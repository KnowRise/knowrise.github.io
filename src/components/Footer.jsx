export default function Footer() {
  return (
    <>
      <div className="flex flex-col items-end">
        <h1 className="text-[24px] font-bold">KnowRise</h1>
        <div className="text-[12px] flex flex-col items-end">
          <p>Stay Positive and Be Yourself</p>
          <p>
            Developed by me using{" "}
            <a href="https://react.dev/" className="font-bold border-b hover:border-0">
              React
            </a>{" "}
            and{" "}
            <a href="https://tailwindcss.com/" className="font-bold border-b hover:border-0">
              Tailwind CSS
            </a>
            . Spot an issue?{" "}
            <a
              href="mailto:rifaasiraajuddin.123@gmail.com"
              className="border-b hover:border-0"
            >
              Let me know
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
