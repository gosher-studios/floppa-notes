use yew::prelude::*;
use gloo_net::http::Request;

#[function_component(App)]
fn app() -> Html {
  let counter = use_state(|| 0);
  let onclick = {
    let counter = counter.clone();
    move |_| {
      let value = *counter + 1;
      counter.set(value);
    }
  };

  html! {
    <div class="text-4xl">
      <button {onclick}>{ "+1" }</button>
      <p>{ *counter }</p>
    </div>
  }
}

fn main() {
  yew::start_app::<App>();
}
