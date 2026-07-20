# Yulun Zhang Academic Homepage

这是一个可直接部署到 GitHub Pages 的纯静态个人主页。视觉风格参考并对齐：

- <https://lee-zixu.github.io/>
- <https://zh-mingyu.github.io/>

当前已经放入头像和 LightAIR 论文信息。姓名暂按 LightAIR 第一作者信息填写为 `Yulun Zhang`；邮箱、GitHub、教育经历等未确认信息保持为空，不会显示在页面上。

## 修改内容

个人信息、双语简介、新闻、论文、教育经历和获奖信息集中在 [`site-data.js`](site-data.js) 中。

- 头像：`assets/profile.png`
- LightAIR 论文图：`assets/lightair-acmmm26.png`
- 页面样式：`styles.css`
- 页面结构：`index.html`

直接双击 `index.html` 即可本地预览。

## 发布到 GitHub Pages

1. 登录 GitHub，创建一个公开仓库，仓库名必须是 `你的GitHub用户名.github.io`。
2. 当前项目使用仓库 `rainy-london/rainy-london.github.io`，在本目录打开 PowerShell 后运行：

```powershell
git init
git add .
git commit -m "Initial academic homepage"
git branch -M main
git remote add origin https://github.com/rainy-london/rainy-london.github.io.git
git push -u origin main
```

3. 打开仓库的 `Settings` -> `Pages`。
4. 在 `Build and deployment` 中选择 `Deploy from a branch`，分支选择 `main`，目录选择 `/(root)`，然后保存。
5. 等待 GitHub 构建完成后，访问 `https://rainy-london.github.io/`。

以后修改内容后，只需运行：

```powershell
git add .
git commit -m "Update homepage"
git push
```

## 来源与许可

页面继承了同实验室公开主页的视觉语言，并参考了 MIT License 的 AcadHomepage / AcademicPages 生态。项目保留了 `LICENSE` 文件。
