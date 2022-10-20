mod config;

use tide::{Request, Response, Error};
use tide::security::CorsMiddleware;
use mongodb::{Client, Collection};
use serde::{Deserialize, Serialize};
use log::{LevelFilter, info};
use crate::config::Config;

pub type Result<T = (), E = Box<dyn std::error::Error>> = std::result::Result<T, E>;

#[derive(Serialize, Deserialize)]
struct User {
  username: String,
}

#[derive(Clone)]
struct State {
  users: Collection<User>,
}

#[async_std::main]
async fn main() -> Result {
  env_logger::builder().filter_level(LevelFilter::Info).init();
  let config = Config::load("api.toml");
  let db = Client::with_uri_str(config.db)
    .await?
    .database("floppa-notes");
  let mut app = tide::with_state(State {
    users: db.collection("users"),
  });
  app.with(CorsMiddleware::new());
  app.at("test").get(test);
  app.at("auth/callback").get(auth_callback);
  app.listen(config.listen).await?;
  Ok(())
}

#[derive(Deserialize)]
struct Callback {
  code: String,
}

async fn auth_callback(req: Request<State>) -> Result<Response, Error> {
  info!("github code {}", req.query::<Callback>()?.code);
  Ok(":D".into())
}

async fn test(req: Request<State>) -> Result<Response, Error> {
  let count = req.state().users.count_documents(None, None).await?;
  Ok(count.to_string().into())
}
