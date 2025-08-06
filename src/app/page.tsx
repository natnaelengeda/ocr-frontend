
// Home
import Home from "@/components/home";
import List from "@/components/list";


export default function page() {
  return (
    <div className="w-full h-full flex flex-col items-start justify-start gap-5">
      <Home />
      <List />
    </div>
  );
}
