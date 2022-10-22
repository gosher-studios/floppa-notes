use tide::{Request, Response, Error, Body, StatusCode};
use mongodb::bson::doc;
use serde::{Serialize, Deserialize};
use crate::{Result, State, auth};

#[derive(Serialize, Deserialize)]
pub struct Note {
  _id: String,
  owner: i64,
  title: String,
  content: String,
}

pub async fn get(req: Request<State>) -> Result<Response, Error> {
  let doc = req
    .state()
    .notes
    .find_one(doc! {"_id": req.param("id")? }, None)
    .await?;
  Ok(match doc {
    Some(d) => {
      if d.owner == auth::get_user(&req).await?.id {
        Body::from_json(&d)?.into()
      } else {
        StatusCode::Unauthorized.into()
      }
    }
    None => StatusCode::NotFound.into(),
  })
}
