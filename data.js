/* 07 Tools 数据。新增工具：在 TOOLS 里加一项，并把工具文件放到 <slug>/index.html。 */
window.TOOLS = [
  {
    slug: "sprite-align",
    name: "Sprite Align",
    ver: "v1.7",
    updated: "2026-11",
    tags: ["2D", "sprite", "gif", "video", "blender", "unity", "godot"],
    desc: {
      zh: "把序列帧、精灵表、GIF 或视频逐帧对齐，再导出成整齐的精灵表。",
      en: "Align image sequences, sprite sheets, GIFs or video frame by frame, then export a clean sprite sheet.",
      ko: "시퀀스·스프라이트 시트·GIF·영상을 프레임별로 정렬한 뒤 깔끔한 스프라이트 시트로 내보냅니다."
    },
    features: {
      zh: ["导入序列帧、精灵表、GIF、视频", "逐帧位移与轴点对齐", "导出网格 / 横条 / 竖条，可设外边距、间距、轴点", "附带 TexturePacker JSON 与 Godot .tres", "内置 Blender / Unity / Godot 填写说明"],
      en: ["Import sequences, sprite sheets, GIFs and video", "Per-frame offset and pivot alignment", "Export as grid / row / column with margin, spacing and pivot", "Optional TexturePacker JSON and Godot .tres", "Built-in setup notes for Blender, Unity and Godot"],
      ko: ["시퀀스·스프라이트 시트·GIF·영상 가져오기", "프레임별 이동과 피벗 정렬", "그리드 / 가로 / 세로 내보내기, 여백·간격·피벗 설정", "TexturePacker JSON과 Godot .tres 동시 출력", "Blender / Unity / Godot 설정 안내 내장"]
    }
  }
];

window.TOOLS_UI = {
  zh: {
    htmlLang: "zh-CN",
    title: "07 工具箱",
    alias: "STUDIO 7 · 离线小工具",
    lead: "做项目时顺手写的小工具。全部在浏览器本地运行，不上传任何文件；每个工具都是单个 HTML，下载后断网也能用。",
    statTools: "工具", statOffline: "本地运行", statUpload: "上传",
    open: "打开工具", download: "下载 .html", updated: "更新",
    readmeTitle: "说明",
    readme: ["所有工具都在你的浏览器里处理文件，不会传到任何服务器。", "每个工具都是一个独立的 HTML 文件，可以直接下载保存，离线打开。", "有问题或建议，欢迎通过主页的联系方式告诉我。"],
    home: "返回 STUDIO 7 主页",
    help: "命令：ls · open <工具> · 1-9 · readme · home · zh/en/ko · light/dark · clear",
    unknown: "未知命令：", opened: "已打开 ", lang: "语言",
    skip: "跳过 [ESC]", skipLabel: "跳过开场动画", boot: "启动动画",
    hint: "移动 = 点亮 · / = 输入命令"
  },
  en: {
    htmlLang: "en",
    title: "07 Tools",
    alias: "STUDIO 7 · Offline utilities",
    lead: "Small tools made along the way. Everything runs locally in your browser and nothing is uploaded. Each tool is a single HTML file you can download and use offline.",
    statTools: "tools", statOffline: "local", statUpload: "uploads",
    open: "Open tool", download: "Download .html", updated: "updated",
    readmeTitle: "Readme",
    readme: ["Every tool processes files inside your browser. Nothing is sent to a server.", "Each tool is one self-contained HTML file — download it and open it offline.", "Questions or ideas? Reach me through the contact details on the homepage."],
    home: "Back to STUDIO 7",
    help: "commands: ls · open <tool> · 1-9 · readme · home · zh/en/ko · light/dark · clear",
    unknown: "command not found: ", opened: "opened ", lang: "language",
    skip: "SKIP [ESC]", skipLabel: "Skip intro", boot: "Boot animation",
    hint: "move = light · / = command"
  },
  ko: {
    htmlLang: "ko",
    title: "07 도구",
    alias: "STUDIO 7 · 오프라인 도구",
    lead: "작업하면서 만든 작은 도구들입니다. 모두 브라우저에서 로컬로 실행되며 파일을 업로드하지 않습니다. 각 도구는 HTML 파일 하나라서 내려받아 오프라인에서도 쓸 수 있습니다.",
    statTools: "도구", statOffline: "로컬 실행", statUpload: "업로드",
    open: "도구 열기", download: ".html 내려받기", updated: "업데이트",
    readmeTitle: "안내",
    readme: ["모든 도구는 브라우저 안에서 파일을 처리하며 서버로 보내지 않습니다.", "각 도구는 독립된 HTML 파일 하나이므로 내려받아 오프라인으로 열 수 있습니다.", "문의나 제안은 홈페이지의 연락처로 보내 주세요."],
    home: "STUDIO 7 홈으로",
    help: "명령어: ls · open <도구> · 1-9 · readme · home · zh/en/ko · light/dark · clear",
    unknown: "알 수 없는 명령: ", opened: "열림 ", lang: "언어",
    skip: "건너뛰기 [ESC]", skipLabel: "시작 애니메이션 건너뛰기", boot: "시작 애니메이션",
    hint: "이동 = 밝히기 · / = 명령 입력"
  }
};
