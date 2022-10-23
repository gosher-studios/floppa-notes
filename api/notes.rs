use tide::{Request, Response, Error, Body, StatusCode};
use mongodb::bson;
use serde::{Serialize, Deserialize};
use crate::{Result, State, auth};

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

pub async fn get(req: Request<State>) -> Result<Response, Error> {
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
        StatusCode::Ok.into()
      } else {
        StatusCode::Unauthorized.into()
      }
    }
    None => StatusCode::NotImplemented.into(), // todo create note
  })
}
