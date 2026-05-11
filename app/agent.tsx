import { googleSansCode, robotoSlab } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export function Agent() {
  return (
    <section className="flex justify-between max-md:flex-col">
      <div className="flex flex-col gap-2">
        <div className="mb-6">
          <div className="inline-block px-1.5 py-1 font-semibold! bg-foreground text-background -translate-x-4 translate-y-3 -rotate-12">
            敬请期待
          </div>
          <h2 className={cn("text-5xl *:font-semibold! space-x-2", robotoSlab.className)}>
            <span className={cn("text-[#bb4d00] dark:text-[#cb6018]", googleSansCode.className)}>???</span>
<<<<<<< HEAD
            <span>Move MagSafe</span>
          </h2>
        </div>
        <span className="text-lg">一个会自己移动的充电器</span>
=======
            <span>move MagSafe</span>
          </h2>
        </div>
        <span className="text-lg">会自动找手机的充电器</span>
>>>>>>> 789d1358d11d428c54e9c8c63ffb5f01d973e0c8
      </div>
      <div className="flex flex-col justify-end items-end gap-2">
        <span className="text-xl">🪨</span>
        <span className="text-sm text-secondary-foreground">
<<<<<<< HEAD
          * 目前本人的开发重心（也许吧），尚未完工
=======
          * 目前本人的开发重心，尚未完工
>>>>>>> 789d1358d11d428c54e9c8c63ffb5f01d973e0c8
        </span>
      </div>
    </section>
  );
}
