mod auth;
mod config;
mod notes;

use tide::security::CorsMiddleware;
use tide::http::headers::HeaderValue;
use mongodb::{Client as MongoClient, Collection};
use reqwest::Client;
use log::info;
use crate::auth::User;
use crate::config::Config;
use crate::notes::Note;

pub type Result<T = (), E = Box<dyn std::error::Error>> = std::result::Result<T, E>;

#[derive(Clone)]
pub struct State {
  reqwest: Client,
  config: Config,
  notes: Collection<Note>,
  users: Collection<User>,
}

impl State {
  async fn new(config: Config) -> Result<Self> {
    let db = MongoClient::with_uri_str(config.db.clone())
      .await?
      .database("floppa-notes");
    info!("Connected to MongoDB.");
    Ok(Self {
      reqwest: Client::builder().user_agent("floppa notes").build()?,
      config,
      notes: db.collection("notes"),
      users: db.collection("users"),
    })
  }
}

#[async_std::main]
async fn main() -> Result {
  tide::log::start();
  let config = Config::load("api.toml");
  let mut app = tide::with_state(State::new(config.clone()).await?);
  app.with(CorsMiddleware::new().allow_methods("GET, POST, DELETE".parse::<HeaderValue>()?));
  app.at("notes").get(notes::get_all).post(notes::create);
  app
    .at("notes/:id")
    .get(notes::get_id)
    .post(notes::update)
    .delete(notes::delete);
  app.at("auth/callback").get(auth::callback);
  app.listen(config.listen).await?;
  Ok(())
}
