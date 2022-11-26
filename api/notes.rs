use tide::{Request, Response, Error, Body, StatusCode};
use mongodb::bson;
use mongodb::options::UpdateOptions;
use serde::{Serialize, Deserialize};
use nanoid::nanoid;
use async_std::stream::StreamExt;
use crate::{Result, State, auth};
use log::info;
#[derive(Serialize, Deserialize)]
pub struct Note {
  _id: String,
  owner: i64,
  title: String,
  content: String,
}

impl Note {
  async fn get(req: &Request<State>) -> Result<Option<Self>, Error> {
    Ok(
      req
        .state()
        .notes
        .find_one(bson::doc! {"_id": req.param("id")? }, None)
        .await?,
    )
  }

  async fn editable(&self, req: &Request<State>) -> Result<bool, Error> {
    Ok(self.owner == auth::get_user(&req).await?.id)
  }
}

#[derive(Deserialize)]
struct NoteUpdate {
  title: Option<String>,
  content: Option<String>,
}

pub async fn create(req: Request<State>) -> Result<Response, Error> {
  let id = nanoid!();
  let uid = auth::get_user(&req).await?.id;
  req
    .state()
    .notes
    .insert_one(
      Note {
        _id: id.clone(),
        owner: auth::get_user(&req).await?.id,
        title: "New Note".to_string(),
        content: String::new(),
      },
      None,
    )
    .await?;
  req
    .state()
    .users
    .update_one(
      bson::doc! {"owner":uid},
      bson::doc! {"$push": {"notes":{"name": "New Note".to_string(), "id": id.clone()}}},
      Some(UpdateOptions::builder().upsert(true).build()),
    )
    .await?;
  Ok(id.into())
}

pub async fn get_all(req: Request<State>) -> Result<Response, Error> {
  let id = auth::get_user(&req).await?.id;
  let users = &req.state().users;
  let index = users
    .find_one(bson::doc! {"owner": id}, None)
    .await?
    .unwrap();
  Ok(Body::from_json(&index)?.into())
  //TODO WHY THE FUCK DOES THIS NOT WORK
}

pub async fn get_id(req: Request<State>) -> Result<Response, Error> {
  Ok(match Note::get(&req).await? {
    Some(note) => {
      if note.editable(&req).await? {
        Body::from_json(&note)?.into()
      } else {
        StatusCode::Unauthorized.into()
      }
    }
    None => StatusCode::NotFound.into(),
  })
}

pub async fn update(mut req: Request<State>) -> Result<Response, Error> {
  Ok(match Note::get(&req).await? {
    Some(note) => {
      if note.editable(&req).await? {
        let update: NoteUpdate = req.body_json().await?;
        req
          .state()
          .notes
          .update_one(
            bson::doc! {"_id": req.param("id")?},
            bson::doc! {"$set": {
              "title": update.title.unwrap_or(note.title),
              "content": update.content.unwrap_or(note.content)
            }},
            None,
          )
          .await?;
        //todo add changes to index in user mongodb
        StatusCode::Ok.into()
      } else {
        StatusCode::Unauthorized.into()
      }
    }
    None => StatusCode::NotFound.into(),
  })
}

pub async fn delete(req: Request<State>) -> Result<Response, Error> {
  Ok(match Note::get(&req).await? {
    Some(note) => {
      if note.editable(&req).await? {
        req
          .state()
          .notes
          .delete_one(bson::doc! {"_id": req.param("id")?}, None)
          .await?;
        StatusCode::Ok.into()
      } else {
        StatusCode::Unauthorized.into()
      }
    }
    None => StatusCode::NotFound.into(),
  })
}
