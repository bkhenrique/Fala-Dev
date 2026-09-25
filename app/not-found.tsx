import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-4 py-24">
      <p className="text-sm font-medium text-emerald-600">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Essa página não existe</h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        Talvez a aula tenha mudado de nome ou de trilha. Volte pro início e escolha pelo menu.
      </p>
      <Link href="/" className="mt-6 rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700">
        Voltar pro início
      </Link>
    </main>
  );
}
