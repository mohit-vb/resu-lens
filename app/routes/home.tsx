import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ResuLens" }, { name: "description", content: "Welcome!" }];
}

export default function Home() {
  return <Welcome />;
}
