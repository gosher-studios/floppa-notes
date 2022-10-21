use tide::{Request, Response, Error, Redirect};
use serde::Deserialize;
use crate::{Result, State};

#[derive(Deserialize)]
struct GithubCallback {
  code: String,
}

#[derive(Deserialize)]
struct GithubLogin {
  access_token: String,
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
