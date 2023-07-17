const Footer = () => {
  return (
    <div className="bg-gray-700 w-full py-1 text-center text-white">
      © {new Date().getFullYear()} All Rights Reserved By
      <a className="ml-1 hover:text-emerald-400 " href="https://sat9.in/">SAT9</a>
    </div>
  );
};
export default Footer;
