import Link from "next/link";

const Success = () => (
  <div>
    <h1>Thanks, your purchase is complete</h1>
    <Link href="/">
      <a>Home</a>
    </Link>
  </div>
);

export default Success;
