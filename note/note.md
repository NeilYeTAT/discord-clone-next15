## 基本配置 0:00:00

**记得使用无痕模式开发~我也不知道是我浏览器哪个插件, 控制台一直给我报错...**
**我项目使用的是 `~` 作为路径别名, 某些情况下复制的代码使用的是 `@` 报错找不到模块, 请修改成 `~`, 注意一下**

> shadcn ui 不支持 Tailwind CSS v4...

在创建文件夹时, up 使用了 (routes) 路由组来隔离 layout.tsx.
说实话, 确实还挺直观的, 将布局和页面隔离开~

```shell
- (main)
  - (routes)
  layout.tsx

- (auth)
  - (routes)
  layout.tsx
```

## 身份验证 0:37:07

使用了 `@clerk/nextjs` 进行身份验证, 本来想使用 `next-auth` 的, 但是人总要尝试点新东西的, 不是嘛~

Tips: 最新文档导入了这么一堆, 其中两个登陆登出按扭没必要展示~
另外新创建的仪表盘下面的教程, 默认公开了所有线路, 没有保护任何页面, 可以取下面这个官网这里看详细步骤~

[clerk 官网](https://clerk.com/docs/references/nextjs/custom-sign-in-or-up-page)

这样就保护了所有的页面, 访问首页重定向到登陆页面~
登陆成功后才能访问受保护的页面~

```tsx
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
// -
return (
  <ClerkProvider>
    <html lang="en" className={OpenSansFont.className}>
      <body className="h-full">
        {/* <SignedOut>
            <SignInButton />
          </SignedOut> */}
        {/* <SignedIn>
            <UserButton />
          </SignedIn> */}
        可以留一个这个, 登陆成功后首页会展示你的头像~
        <UserButton />
        {children}v
      </body>
    </html>
  </ClerkProvider>
)
```

[[...sign-in]] 动态路由语法, 这个 `[[...foldName]]` 可以捕获 `foldName/a/b/c...`

Next.js 15 返回的是`promise`，需要`await` 获取动态路由(占位参数)哦~

不过官网说现在还可以不用 await, 但是战未来, 这里提一嘴~

[Nextjs 官网](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)

```shell
In version 14 and earlier, params was a synchronous prop. To help with backwards compatibility, you can still access it synchronously in Next.js 15, but this behavior will be deprecated in the future.

在版本14和更早的版本中， params是同步道具。为了帮助向后兼容，您仍然可以在Next.js 15中同步访问它，但是将来将弃用此行为。
```

现在添加完 `clerk` 之后就可以测试了 `http://localhost:3000/sign-in`

预期应该出现一个表单, 使用 google 登陆成功后, 应该可以看到左上角有自己的头像~

可以开始画页面了~

## 添加亮暗模式开关 0:50:06

**后序开发为了方便, 先去 middleware.ts 放行**

up 创建了一个 `providers` 文件夹, 卧槽, 我之前都是放在 lib 中的...

```tsx
<ThemeProvider
  attribute="class" // 在 html 标签的 class 属性上添加 dark | light
  defaultTheme="system" // 系统默认主题
  enableSystem // 跟随系统切换
  disableTransitionOnChange // 切换主题时禁用动画过渡(transition), 防止闪烁
>
  {children}
</ThemeProvider>
```

添加完这个后必顶水合错误错误 😅😅😅, 妈的.
在 html 标签上添加 `suppressHydrationWarning` 解决.

我觉得 shadcn 提供的亮暗模式开关挺不合理的...因此我这里改造了一下~
没有使用下拉菜单点击实现, 而是点击后直接切换亮暗模式~

最后调整了一下背景颜色, 防止 light 模式下直接亮瞎我的眼睛眼睛 🥺

## 数据库 0:59:10

视频中使用的数据库服务现在好像收费, 没找到免费的按扭...

直接本地起一个, 肥肠简单~

**1:15:50** 开始开发新用户登陆, 要求创建一个新的个人资料~

用户创建服务器页面的表单.

使用了 zod 和 React Hook Form, 之后再去单独学习~

**1:46:25** 开始开发图片上传组件

[图片上传服务~](https://uploadthing.com/)

**2:07:44** 这里上传图片, 如果你的图片不显示出来, 可以添加最后一个属性~

```tsx
<Image
  fill
  src={value}
  alt="upload image"
  className="rounded-full"
  unoptimized // 添加这个
/>
```

**2:09:35** 处理创建服务器的接口

**2:20:47** 重定向到服务器页面

这里基本上都是写样式, 稍微注意下如果图片加载不出来, 和上面的 Image 标签一样, 加一个 `unoptimized`.

**2:49:26** 开始写点击顶部添加按扭后, 创建一个新的服务器的功能~

**3:02:31** 侧边栏已经完成, 现在准备渲染点击侧边栏后, 展示对应的频道的页面~

**3:32:14** 开始开发下拉菜单的各项功能

1. 使用邀请码邀请他人进入服务器 **3:47:44**

2. 服务器设置 **4:06:24**

3. 成员管理 **4:15:40**
   - **4:31:19** 完成基本的页面, 准备开发管理成员的具体功能
   - **4:54:43** 完成权限修改的功能, 下一步是踢人功能~
