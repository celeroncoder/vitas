import { Sidebar } from "@/components/sidebar";
import { Title } from "@/components/ui/title";
import { Wrapper } from "@/components/wrapper";

export default async function IDCardPage() {
  return (
    <Wrapper>
      <div className="flex w-full flex-1">
        <Sidebar />
        <main className="flex-1 px-4 pt-2 pb-4">
          <div className="mb-4">
            <Title className="text-3xl">ID Card</Title>
            <p className="text-muted-foreground">Manage ID Card</p>
          </div>
          <section className="flex flex-wrap items-start gap-10">
            {/* front */}
            <div className="relative overflow-hidden select-none bg-foreground text-background w-[552px] h-[368px] rounded-lg shadow-sm hover:shadow-lg hover:scale-105 duration-150 flex flex-col justify-between p-10">
              <div>
                <Title className="text-4xl">John Doe</Title>
                <p className="text-md">@johndoe</p>
              </div>
              <div className="text-muted-foreground">
                <p>Founder & CEO</p>
                <p className="font-bold">GETID.ORG</p>
              </div>

              <div className="absolute -z-0 max-h-fit w-[552px] leading-tight text-center -right-52 bottom-24 rotate-90 text-9xl font-extrabold text-muted-foreground">
                XOXOXO
              </div>
            </div>

            {/* back */}
            <div className="relative overflow-hidden select-none bg-foreground text-background w-[552px] h-[368px] rounded-lg shadow-sm hover:shadow-lg hover:scale-105 duration-150 flex flex-col items-center justify-end p-10">
              <div className="font-semibold text-lg text-muted-foreground">
                www.getid.tech
              </div>
              <div className="absolute -z-0 tracking max-h-fit w-[552px] leading-tight text-center -right-52 bottom-24 rotate-90 text-9xl font-extrabold text-muted-foreground">
                XOXOXO
              </div>
            </div>
          </section>
        </main>
      </div>
    </Wrapper>
  );
}
