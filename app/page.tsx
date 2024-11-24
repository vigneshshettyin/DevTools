import { ListToString } from "./components/list-to-string";
import { StringToList } from "./components/string-to-list";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">DevTools</h1>
      <ListToString />
      <StringToList />
    </div>
  );
}
