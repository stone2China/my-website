import { Page } from "@/components/page";

export default function Donate() {
  return (
    <Page title="打赏" className="*:text-center">
      <p>如果你对我的项目感到满意，欢迎打赏支持！😎</p>
      <img
        className="mt-10 ml-auto mr-auto shadow-md"
        src="/static/donate.jpg"
        alt="donate"
        width={384}
        height={384}/>
    </Page>
  );
}
