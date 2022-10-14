use yew::prelude::*;

#[function_component(App)]
fn app() -> Html {
  html! {
    <h1 class="text-red-500">{ "hi" }</h1>
  }
}

fn main() {
  yew::start_app::<App>();
}
