import CustomLink from "./custom-link";
export default function Login() {
  return (
    <CustomLink href="/login">
      <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 group">
        <img src="/login.svg" alt="Login" className="w-6 h-6 rounded-full " />
        <span className="ml-2 text-white font-bold">ログイン</span>
      </div>
    </CustomLink>
  );
}
