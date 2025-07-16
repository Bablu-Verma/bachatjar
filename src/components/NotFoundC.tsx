
import Image from "next/image";
import Link from "next/link";
import error from '../../public/error.svg'

type NotFoundCProps = {
  title?: string;
};

const NotFoundC = ({ title }: NotFoundCProps) => {
  return (
    <div className="flex justify-center items-center flex-col">
      <Image height={300} width={300} src={error} alt="error" className="w-[250px] md:w-[300px] h-[250px] md:h-[300px]" />
      <div className="pt-5 flex justify-center items-center flex-col">
        <h3 className="text-secondary text-xl md:text-2xl font-medium ">{title} Not Found</h3>
        <div className="h-8"></div>
        <Link className="inline-block px-8 py-1.5 text-white bg-primary rounded-full text-sm md:text-base  font-medium shadow hover:bg-primary/90 transition-all" href="/">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundC