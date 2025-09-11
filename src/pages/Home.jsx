import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons";
// import MyFoto from "../assets/img/MyFoto.png";

export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-[2rem] py-[4rem]">
        <div className="flex items-center gap-[24px]">
          <div className="flex flex-col max-w-[70%] gap-[1rem]">
            <div className="flex flex-col gap-0">
              <h1 className="text-[48px] font-montserrat">
                Muhammad <span className="font-bold">Rifaa </span>Siraajuddin
                Sugandi
              </h1>
              <h2 className="text-[32px] font-libertinus-keyboard">
                Backend Developer
              </h2>
            </div>
            <p className="text-[16px]">
              A 2025 graduate from SMKN 2 Sukabumi with a specialization in
              Software Engineering. As a Junior Backend Developer at a local
              startup, I'm actively involved in building and maintaining
              efficient and reliable backend systems. While working, I am also
              advancing my knowledge by pursuing an Informatics degree at BSI
              University, which allows me to blend practical industry experience
              with strong theoretical foundations.
            </p>
            <p className="text-[16px]">
              I am a curious and persistent individual who is genuinely
              passionate about problem-solving. I believe that the best
              solutions come from a deep understanding of the core issue, and I
              enjoy the process of breaking down complex challenges into
              manageable parts. This methodical approach drives my work and my
              commitment to continuous learning.
            </p>
          </div>
          <div className="w-[240px] h-[240px] rounded-full overflow-hidden">
            {/* <img
              src={MyFoto}
              alt=""
              className="object-top object-cover bg-gray-900 w-full h-full"
            /> */}
            <img
              src="/img/MyFoto.png"
              alt=""
              className="object-top object-cover bg-gray-900 w-full h-full"
            />
          </div>
        </div>
        <div className="flex flex-col gap-[2rem] text-[18px]">
          <div className="flex gap-[1rem] items-center">
            <p>You can find me</p>
            <a href="https://www.instagram.com/rifaa_srjdn/" target="blank">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://github.com/KnowRise" target="blank">
              <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
