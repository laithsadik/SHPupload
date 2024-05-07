
export default function ContactFormAnswers() {
  return (
    <div>
      <main className="">
        <div className="flex flex-col sm:flex-row sm:justify-around gap-2">
          <div className="flex flex-col max-w-5xl w-full">
            <h1 className="text-left text-3xl font-semibold mt-36 ml-20">
              Your request has been received. We will contact you <br />
              as soon as possible.
            </h1>
          </div>
          <div
            className="w-[350px] border-l-4 mt-20 mr-5 hidden flex-col sm:block"
            dir="ltr"
          >
            
          </div>
        </div>
      </main>
    </div>
  );
}
