import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
    <Image src="/logo.png" alt="Profissionais SA" width={100} height={100} className="mb-6" />
    <h1 className="text-4xl font-bold text-gray-800 mb-4">Profissionais SA</h1>
    <p className="text-gray-600 text-lg mb-8">Desafio Técnico Nível Pleno</p>
    <Link
      href="/instructions"
      className="px-6 py-3 bg-[#FF640F] text-white text-lg hover:bg-[#FF640F]/80 transition font-bold"
    >
      VER INSTRUÇÕES
    </Link>
  </main>
  );
}
