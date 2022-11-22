use tide::{Request, Response, Error, Redirect, StatusCode};
use serde::{Serialize, Deserialize};
use crate::{Result, State};

#[derive(Deserialize)]
struct GithubCallback {
  code: String,
}

#[derive(Deserialize)]
struct GithubLogin {
  access_token: String,
}

#[derive(Deserialize)]
pub struct GithubUser {
  pub id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
  pub _id: String,
  pub owner: i64,
  pub notes: Vec<Note>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Note {
  pub id: String,
  pub name: String,
}
pub async fn callback(req: Request<State>) -> Result<Response, Error> {
  let state = req.state();
  let res: GithubLogin = state
    .reqwest
    .post(format!(
      "https://github.com/login/oauth/access_token?client_id={}&client_secret={}&code={}",
      state.config.github_id,
      state.config.github_secret,
      req.query::<GithubCallback>()?.code
    ))
    .header("Accept", "application/json")
    .send()
    .await?
    .json()
    .await?;
  Ok(
    Redirect::new(format!(
      "http://localhost:1234/callback?token={}",
      res.access_token
    ))
    .into(),
  )
}

pub async fn get_user(req: &Request<State>) -> Result<GithubUser, Error> {
  let token = match req.header("Authorization") {
    Some(a) => a.as_str(),
    None => return Err(Error::from_str(StatusCode::Unauthorized, "no token")),
  };
  Ok(
    req
      .state()
      .reqwest
      .get("https://api.github.com/user")
      .header("Authorization", token)
      .send()
      .await?
      .json()
      .await?,
  )
}
