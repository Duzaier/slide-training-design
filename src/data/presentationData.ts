import { SlideData } from '../types/presentation';
import { getAssetUrl } from '../utils/assetHelper';

const rawPresentationSlides: SlideData[] = [
  {
    id: 1,
    slideNumber: "01",
    category: "overview",
    categoryLabel: "SPEAKER PROFILE",
    title: "PHẠM LAI ĐĂNG KHOA",
    subtitle: "Thực tập sinh DiepLam Printing & Design • Freelancer Upwork • Chủ tịch Gen 5",
    primaryText: "Chuyên gia thiết kế đồ họa thương mại & tối ưu hóa hệ thống nhận diện bài đăng mạng xã hội đa nền tảng.",
    keyPoints: [
      "Thực tập sinh DiepLam Printing & Design",
      "Freelancer Upwork",
      "Chủ tịch Gen 5"
    ],
    specs: [
      { label: "EXPERIENCE", value: "DiepLam Printing", sub: "Production & Design" },
      { label: "PLATFORM", value: "Freelancer Upwork", sub: "Global Commercial Visuals" },
      { label: "LEADERSHIP", value: "Chủ tịch Gen 5", sub: "Creative & Mentorship" }
    ],
    images: [
      {
        url: "/assets/speaker_portrait.png",
        caption: "Phạm Lai Đăng Khoa • Speaker Profile",
        role: "primary"
      }
    ],
    layoutType: "hero_cover",
    notes: "Slide mở đầu giới thiệu thông tin diễn giả Phạm Lai Đăng Khoa: Thực tập sinh DiepLam Printing & Design, Freelancer Upwork, Chủ tịch Gen 5."
  },
  {
    id: 2,
    slideNumber: "02",
    category: "concept_design",
    categoryLabel: "CONCEPT & DESIGN",
    title: "Concept và tính thiết kế",
    primaryText: "Định hình ngôn ngữ thị giác, ý tưởng chủ đạo và tính ứng dụng của thiết kế đồ họa thương mại.",
    images: [
      {
        url: "/assets/slide2_poster_1.png",
        caption: "Key Visual Concept 01 • Cổng Trường Đồ Họa"
      },
      {
        url: "/assets/slide2_poster_2.png",
        caption: "Key Visual Concept 02 • Sale Ngày Đôi Nhân Đôi Ưu Đãi"
      }
    ],
    layoutType: "concept_minimal",
    notes: "Slide 02 giới thiệu Concept và tính thiết kế với 2 tác phẩm Poster thương mại thực chiến."
  },
  {
    id: 3,
    slideNumber: "03",
    category: "concept_design",
    categoryLabel: "AI IN DESIGN",
    title: "AI hỗ trợ được gì trong thiết kế?",
    primaryText: "Ứng dụng AI trong sáng tạo ý tưởng hình ảnh, tối ưu hóa quy trình kết xuất và thiết kế thương mại.",
    images: [
      {
        url: "/assets/bt 1.png",
        caption: "WARRIOR Nước Tăng Lực Vị Dâu • Unleash YOUR Energy"
      }
    ],
    layoutType: "ai_design_minimal",
    notes: "Slide 03: AI hỗ trợ được gì trong thiết kế? với tác phẩm visual nước tăng lực WARRIOR Vị Dâu."
  },
  {
    id: 4,
    slideNumber: "04",
    category: "concept_design",
    categoryLabel: "GEN MODEL",
    title: "Gen model",
    primaryText: "Quy trình kết hợp giữa ảnh chụp mẫu thực tế, xử lý tạo hình 3D AI và đóng gói hoàn thiện thành Key Visual thương mại.",
    images: [
      {
        url: "/assets/slide4_real_model.png",
        caption: "01 • Mẫu thực tế"
      },
      {
        url: "/assets/slide4_pose_ref.png",
        caption: "02 • Dáng tham chiếu"
      },
      {
        url: "/assets/slide4_ai_model.png",
        caption: "03 • Model AI"
      }
    ],
    layoutType: "gen_model_minimal",
    notes: "Slide 04: Gen model - quy trình từ ảnh chụp thực tế đến mô hình 3D AI và poster hoàn thiện."
  },
  {
    id: 5,
    slideNumber: "05",
    category: "lighting_3d",
    categoryLabel: "LIGHTING & 3D",
    title: "Tạo góc nhìn cơ bản về ánh sáng",
    primaryText: "Phân tích nguyên lý hướng sáng, bóng đổ và phản xạ bề mặt trong thiết kế phối cảnh 3D.",
    images: [
      {
        url: "/assets/image 3.png",
        caption: "Infographic Phân Tích Ánh Sáng • Mô Hình 3D Isometric"
      },
      {
        url: "/assets/image 17.png",
        caption: "Render Xe Tải 3D Phối Cảnh Lưới Isometric"
      }
    ],
    layoutType: "lighting_minimal",
    notes: "Slide 05: Tạo góc nhìn cơ bản về ánh sáng với sơ đồ phân tích hướng chiếu và phối cảnh 3D Isometric."
  },
  {
    id: 6,
    slideNumber: "06",
    category: "commercial_design",
    categoryLabel: "GEN AI IN PRACTICE",
    title: "Gen AI thế nào cho đúng?",
    primaryText: "Định hướng ứng dụng Generative AI đúng quy chuẩn vào hệ thống thiết kế thương mại thực tế.",
    images: [
      {
        url: "/assets/image 4.png",
        caption: "Bố Cục 4 Ảnh Social Post • F-CODER / F-SEC / F-TECH"
      },
      {
        url: "/assets/image 5.png",
        caption: "Key Visual Hovilo Dạ Vũ • Lễ Tôn Vinh Học Kỳ Summer 2026"
      },
      {
        url: "/assets/Nhà cái 1.png",
        caption: "Visual Công Bố Đơn Vị Tài Trợ • Storylab Creative"
      },
      {
        url: "/assets/CD đóng form 1.png",
        caption: "Poster Đếm Ngược 24h Đóng Form • Võ Việt Hội Tụ"
      }
    ],
    layoutType: "gen_ai_grid_minimal",
    notes: "Slide 06: Gen AI thế nào cho đúng? với 4 tác phẩm thiết kế thực chiến đa dạng chủ đề và phong cách."
  },
  {
    id: 7,
    slideNumber: "07",
    category: "commercial_design",
    categoryLabel: "AI PROMPTING & WORKFLOW",
    title: "Promt thế nào",
    primaryText: "Kỹ thuật giao tiếp và prompt AI: Kết hợp tham chiếu dáng (Pose Reference) và nhân vật gốc (Model Reference) để tái tạo chính xác tư thế mong muốn.",
    images: [
      {
        url: "/assets/image 7.png",
        caption: "Workflow Prompting: Tái hiện dáng thế từ ảnh tham chiếu và model nhân vật thực tế"
      }
    ],
    layoutType: "prompt_minimal",
    notes: "Slide 07: Promt thế nào - Minh họa trực quan câu lệnh điều khiển AI kết hợp Image-to-Image và Pose Transfer."
  },
  {
    id: 8,
    slideNumber: "08",
    category: "commercial_design",
    categoryLabel: "CORE DESIGN QUESTION",
    title: "Cần kiến thức gì để sử dụng AI hiệu quả?",
    primaryText: "Nền tảng kiến thức thị giác, tư duy mỹ thuật, ánh sáng và màu sắc là chìa khóa để điều khiển và tối ưu hóa sức mạnh của AI trong thiết kế chuyên nghiệp.",
    images: [],
    layoutType: "editorial_question_minimal",
    notes: "Slide 08: Cần kiến thức gì để sử dụng AI hiệu quả? - Slide câu hỏi chuyển tiếp dẫn dắt vào các nguyên lý thiết kế."
  },
  {
    id: 9,
    slideNumber: "09",
    category: "commercial_design",
    categoryLabel: "CORE DESIGN PRINCIPLES",
    title: "Tư duy cơ bản về thiết kế như\nánh sáng, bố cục, màu sắc",
    primaryText: "Nắm vững các nguyên lý cốt lõi: ánh sáng, bố cục và màu sắc để chủ động định hướng chất lượng thị giác cho sản phẩm thiết kế.",
    images: [],
    layoutType: "editorial_question_minimal",
    notes: "Slide 09: Tư duy cơ bản về thiết kế như ánh sáng, bố cục, màu sắc - Nền tảng tư duy thị giác."
  },
  {
    id: 10,
    slideNumber: "10",
    category: "lighting_3d",
    categoryLabel: "LIGHTING IN PRACTICE",
    title: "Ánh Sáng",
    primaryText: "Nghiên cứu nguyên lý chiếu sáng cơ bản trên các khối hình học (Cầu, Hộp, Trụ) và ứng dụng thực chiến vào Key Visual thương mại Shopee Mall x AHC 11.11 Huyền Bí.",
    images: [
      {
        url: "/assets/Các khối 1.png",
        caption: "Nguyên Lý Ánh Sáng & Bóng Đổ Trên Các Khối Cơ Bản"
      },
      {
        url: "/assets/bài tập 1.png",
        caption: "Key Visual Thương Mại Shopee Mall x AHC • 11.11 Huyền Bí"
      }
    ],
    layoutType: "lighting_duo_minimal",
    notes: "Slide 10: Ánh Sáng - Minh họa từ lý thuyết bóng khối cơ bản đến tác phẩm thương mại thực tế."
  },
  {
    id: 105,
    slideNumber: "10B",
    category: "lighting_3d",
    categoryLabel: "3D LIGHTING & SHADOW LAB",
    title: "Mô phỏng 3D: Nguyên lý ánh sáng & bóng đổ khối hộp",
    primaryText: "Mô phỏng trực quan 360 độ hướng chiếu sáng, đổ bóng và phân tích 4 vùng giải phẫu sắc độ (Highlight, Midtone, Core Shadow, Cast Shadow) trên khối hộp vuông 3D.",
    images: [],
    layoutType: "cube_lighting_studio",
    notes: "Phần phụ mô phỏng 3D: Người thuyết trình có thể xoay nguồn sáng 360 độ để giảng giải chi tiết về nguyên lý ánh sáng, bóng đổ và bề mặt phản quang trên khối hộp vuông."
  },
  {
    id: 11,
    slideNumber: "11",
    category: "commercial_design",
    categoryLabel: "COMPOSITION & PERSPECTIVE",
    title: "Bố cục, phối cảnh",
    primaryText: "Nghiên cứu nguyên lý bố cục phối cảnh chiều sâu (Perspective), đường dẫn thị giác và phân tầng không gian trong Key Visual thương mại E-Commerce Shopee Xả Kho Voucher Cực Lớn.",
    images: [
      {
        url: "/assets/Bài tập 2.png",
        caption: "Key Visual Shopee Xả Kho Voucher Cực Lớn • Phối Cảnh & Đường Dẫn Thị Giác"
      }
    ],
    layoutType: "composition_perspective_minimal",
    notes: "Slide 11: Bố cục, phối cảnh - Minh họa kỹ thuật xây dựng phối cảnh 1 điểm tụ và đường dẫn thị giác trong thiết kế banner thương mại điện tử."
  },
  {
    id: 12,
    slideNumber: "12",
    category: "color_theory",
    categoryLabel: "LÝ THUYẾT MÀU SẮC",
    title: "Màu sắc",
    primaryText: "Hệ thống phân cấp 5 sắc độ màu sắc chủ đạo trong thiết kế thương mại: Màu chính, Mắt màu sáng, Mắt màu tối, Màu bổ trợ, Màu nhấn.",
    keyPoints: [
      "Màu chính: Định hình tone màu chủ đạo của toàn bộ Key Visual.",
      "Mắt màu sáng: Tạo chiều sâu bề mặt và nguồn sáng phản chiếu.",
      "Mắt màu tối: Đổ bóng và tương phản khối cho đối tượng.",
      "Màu bổ trợ: Làm dịu chuyển tiếp giữa vùng sáng và vùng tối.",
      "Màu nhấn: Kích thích thị giác vào thông điệp và Call to Action quan trọng."
    ],
    images: [
      {
        url: "/assets/Phân tích màu 1.png",
        caption: "Bảng Phân Tích 5 Sắc Độ Màu Sắc Key Visual 3D Lumina Academy"
      },
      {
        url: "/assets/image 9.png",
        caption: "Bảng Chọn Màu & Dải Sắc Độ Photoshop Color Palette"
      }
    ],
    layoutType: "color_analysis_minimal",
    notes: "Slide 12: Màu sắc - Phân tích cấu trúc 5 sắc độ màu sắc và công cụ Color Picker."
  },
  {
    id: 13,
    slideNumber: "13",
    category: "color_theory",
    categoryLabel: "VALUE & CONTRAST",
    title: "Value",
    primaryText: "Nguyên lý tương phản giá trị sắc độ (Value / Brightness): Đánh giá độ tương phản sáng tối đảm bảo tính nhận diện và khả năng đọc (Readability) trên mọi nền màu.",
    images: [
      {
        url: "/assets/image 10.png",
        caption: "Catch STAR • Full Color Palette"
      },
      {
        url: "/assets/image 11.png",
        caption: "Catch STAR • Grayscale Value Test"
      },
      {
        url: "/assets/image 13.png",
        caption: "F-BIZ • Low Contrast on Cyan"
      },
      {
        url: "/assets/image 14.png",
        caption: "F-BIZ • Invisible on White"
      },
      {
        url: "/assets/image 15.png",
        caption: "F-BIZ • High Contrast on Deep Navy"
      },
      {
        url: "/assets/image 16.png",
        caption: "F-BIZ • High Contrast on Dark Slate"
      }
    ],
    layoutType: "value_contrast_minimal",
    notes: "Slide 13: Value - So sánh tương phản sáng tối trên logo Catch STAR và F-BIZ."
  },
  {
    id: 14,
    slideNumber: "14",
    category: "concept_art",
    categoryLabel: "ART STYLES & GENRE",
    title: "Style art",
    primaryText: "Tổng hợp các phong cách nghệ thuật đa dạng trong thiết kế & minh họa: Chibi, Monster Sprite, Anime Illustration, Realistic Aesthetic và Commercial Typography Posters.",
    images: [
      {
        url: "/assets/image 18.png",
        caption: "Chibi Character Sprite Pose Sheet"
      },
      {
        url: "/assets/image 19.png",
        caption: "RPG Fantasy Monsters & Creature Sprites"
      },
      {
        url: "/assets/image 20.png",
        caption: "Anime Girl Pastel Aesthetic Portrait"
      },
      {
        url: "/assets/image 21.png",
        caption: "Anime Action Key Visual • Flame Dragon"
      },
      {
        url: "/assets/image 22.png",
        caption: "Photorealistic Cinematic Aesthetic Girl by Window"
      },
      {
        url: "/assets/image 23.png",
        caption: "Commercial Poster: Low G • Summer Flow #2"
      },
      {
        url: "/assets/image 24.png",
        caption: "Commercial Poster: Street Graffiti Champion Avenue"
      },
      {
        url: "/assets/image 25.png",
        caption: "Commercial Poster / Key Visual Art Style"
      }
    ],
    layoutType: "style_art_gallery_minimal",
    notes: "Slide 14: Style art - Triển lãm các phong cách nghệ thuật minh họa và poster thương mại."
  },
  {
    id: 15,
    slideNumber: "15",
    category: "commercial_design",
    categoryLabel: "TYPOGRAPHY",
    title: "Typography",
    primaryText: "Nghiên cứu nghệ thuật thiết kế chữ (Typography) trong Key Visual và nhận diện thương hiệu: Typography 3D góc cạnh, Thư pháp cách điệu và Chữ hiệu ứng kim loại / ngọc bích.",
    keyPoints: [
      "440HZ: Phong cách Typography góc cạnh, năng động với dải màu gradient cam vàng rực rỡ.",
      "Đi qua mùa Hạ: Kiểu chữ thư pháp (Lettering) mềm mại, bay bổng trên nền xanh lục bảo thanh lịch.",
      "Võ Việt Quy Tụ: Kiểu chữ 3D kim loại và rồng vàng uy vũ, kết hợp hiệu ứng khối xanh dương và vàng đồng."
    ],
    images: [
      {
        url: "/assets/LOGO 1.png",
        caption: "440HZ • Dynamic Lightning Typography"
      },
      {
        url: "/assets/Logo dự án 1.png",
        caption: "Đi qua mùa Hạ • Organic Summer Lettering"
      },
      {
        url: "/assets/Untitled-1 1.png",
        caption: "Võ Việt Quy Tụ • 3D Metallic Martial Arts Typography"
      }
    ],
    layoutType: "typography_minimal",
    notes: "Slide 15: Typography - Minh họa 3 tác phẩm thiết kế chữ tiêu biểu (440HZ, Đi qua mùa Hạ, Võ Việt Quy Tụ)."
  },
  {
    id: 16,
    slideNumber: "16",
    category: "commercial_design",
    categoryLabel: "QUY TRÌNH THIẾT KẾ",
    title: "Quy trình thiết kế",
    primaryText: "Quy trình thiết kế đồ họa & Key Visual chuyên nghiệp.",
    images: [],
    layoutType: "editorial_question_minimal",
    notes: "Slide 16: Quy trình thiết kế - Tiêu đề chuyển tiếp quy trình thiết kế."
  },
  {
    id: 17,
    slideNumber: "17",
    category: "commercial_design",
    categoryLabel: "QUY TRÌNH THIẾT KẾ",
    title: "Tiến trình xử lý Key Visual",
    subtitle: "Sự tiến triển qua 5 công đoạn thực hiện Key Visual chuyên nghiệp",
    primaryText: "Quan sát trực tiếp sự tiến triển qua từng giai đoạn xử lý từ bản phác thảo thô (Sketch) đến tác phẩm thương mại hoàn chỉnh (Final Key Visual).",
    images: [
      {
        url: "/assets/image 26.png",
        caption: "01. Sketch & Layout Grid"
      },
      {
        url: "/assets/image 27.png",
        caption: "02. Thay element cơ bản"
      },
      {
        url: "/assets/image 28.png",
        caption: "03. Xử lý background, retouch & ánh sáng chủ thể"
      },
      {
        url: "/assets/image 29.png",
        caption: "04. Xử lý ánh sáng tổng thể"
      },
      {
        url: "/assets/image 30.png",
        caption: "05. Hoàn thiện với hiệu ứng"
      }
    ],
    layoutType: "design_process_unified",
    notes: "Slide 17: Tiến trình xử lý Key Visual - Tích hợp đầy đủ 5 công đoạn từ Sketch, Thay Element, Retouch & BG, Ánh sáng tổng thể đến Hoàn thiện hiệu ứng."
  },
  {
    id: 18,
    slideNumber: "18",
    category: "commercial_design",
    categoryLabel: "CÁCH KẾT HỢP KIẾN THỨC",
    title: "Cách kết hợp kiến thức",
    primaryText: "Phương pháp liên kết, tổng hợp các nguyên lý mỹ thuật và mượn ý tưởng trong thiết kế sáng tạo.",
    images: [],
    layoutType: "editorial_question_minimal",
    notes: "Slide 18: Cách kết hợp kiến thức - Tiêu đề chuyển mục."
  },
  {
    id: 182,
    slideNumber: "18B",
    category: "commercial_design",
    categoryLabel: "CÁCH KẾT HỢP KIẾN THỨC",
    title: "Mượn ý tưởng",
    primaryText: "Khai thác và liên kết bố cục, dáng chuyển động và chất liệu ánh sáng từ các tác phẩm tham chiếu vào thiết kế thực tế.",
    images: [
      {
        url: "/assets/image 37.png",
        caption: "Bản vẽ phác thảo (Sketch Pose)"
      },
      {
        url: "/assets/image 41.png",
        caption: "Tạo hình 3D Key Visual (PUBG)"
      },
      {
        url: "/assets/image 39.png",
        caption: "Chất liệu Cosmic Galaxy"
      },
      {
        url: "/assets/image 40.png",
        caption: "Hệ thống Skin Cosmic (LoL)"
      },
      {
        url: "/assets/Train 1.png",
        caption: "Poster Training Design hoàn thiện"
      }
    ],
    layoutType: "concept_borrowing_stage",
    notes: "Slide 18B: Mượn ý tưởng - Phân tích quy trình mượn ý tưởng từ tham chiếu bố cục (Sketch/PUBG) và chất liệu Galaxy (Anime/LoL) để sáng tạo poster Training Design."
  },
  {
    id: 19,
    slideNumber: "19",
    category: "commercial_design",
    categoryLabel: "KIẾN THỨC CƠ BẢN VỀ SOCIAL POST",
    title: "Size",
    primaryText: "Quy chuẩn kích thước tiêu chuẩn cho các định dạng ấn phẩm Social Media phổ biến (Ảnh vuông 1:1 và Ảnh dọc 4:3 / High-Res).",
    images: [
      {
        url: "/assets/Nhà cái 1.png",
        caption: "Storylab Creative • Ảnh vuông chuẩn Social (1:1)",
        dimensions: "2000X2000"
      },
      {
        url: "/assets/CD đóng form 1.png",
        caption: "Võ Việt Hội Tụ • Ảnh dọc tỉ lệ cao (Vertical 4:3)",
        dimensions: "3660 X 2880"
      }
    ],
    layoutType: "social_size_minimal",
    notes: "Slide 19: Size - Kích thước thiết kế chuẩn social: 2000x2000 (1:1) và 3660x2880 (dọc chất lượng cao)."
  },
  {
    id: 20,
    slideNumber: "20",
    category: "commercial_design",
    categoryLabel: "KIẾN THỨC CƠ BẢN VỀ SOCIAL POST",
    title: "Nhiều ảnh",
    primaryText: "Hệ thống tỉ lệ và bố cục chia khung lưới cho các bài đăng album nhiều ảnh (Multi-photo Posts) trên mạng xã hội.",
    images: [
      {
        url: "/assets/image 31.png",
        caption: "Bài đăng thực tế • 440Hz Giới Thiệu Thành Viên"
      },
      {
        url: "/assets/image 32.png",
        caption: "3 Ảnh (Ảnh chính ngang)"
      },
      {
        url: "/assets/image 33.png",
        caption: "3 Ảnh (Ảnh chính dọc)"
      },
      {
        url: "/assets/image 34.png",
        caption: "4 Ảnh (Ảnh chính ngang)"
      },
      {
        url: "/assets/image 35.png",
        caption: "4 Ảnh (Ảnh chính dọc)"
      },
      {
        url: "/assets/image 36.png",
        caption: "5 Ảnh trở lên (Khung vuông)"
      }
    ],
    layoutType: "social_multi_image_minimal",
    notes: "Slide 20: Nhiều ảnh - Các layout album chuẩn Facebook từ 3 ảnh, 4 ảnh đến 5 ảnh trở lên."
  },
  {
    id: 21,
    slideNumber: "21",
    category: "commercial_design",
    categoryLabel: "KIẾN THỨC CƠ BẢN VỀ SOCIAL POST",
    title: "Lỗi sai kích thước",
    primaryText: "Phân tích tình huống thiết kế sai tỉ lệ hiển thị của nền tảng dẫn đến việc thông tin quan trọng bị cắt xén (crop) trên bảng tin.",
    images: [
      {
        url: "/assets/image 8.png",
        caption: "Infographic dọc bị cắt khung hiển thị trên Facebook News Feed"
      }
    ],
    layoutType: "social_size_error_minimal",
    notes: "Slide 21: Lỗi sai kích thước - Bài học tránh thiết kế sai khổ khiến nội dung quan trọng bị Facebook crop mất."
  },
  {
    id: 22,
    slideNumber: "22",
    category: "commercial_design",
    categoryLabel: "TỔNG QUAN NGÀNH THIẾT KẾ",
    title: "Góc nhìn chung về\nngành hiện nay",
    primaryText: "Bức tranh toàn cảnh về thị trường thiết kế đồ họa & sáng tạo nội dung thương mại trong kỷ nguyên số.",
    images: [],
    layoutType: "editorial_question_minimal",
    notes: "Slide 22: Góc nhìn chung về ngành hiện nay - Tiêu đề chuyển mục tổng quan ngành thiết kế."
  },
  {
    id: 23,
    slideNumber: "23",
    category: "summary",
    categoryLabel: "HỎI ĐÁP & THẢO LUẬN",
    title: "Q&A",
    primaryText: "Phiên hỏi đáp, giải đáp thắc mắc chuyên sâu và trao đổi trực tiếp cùng diễn giả.",
    images: [],
    layoutType: "editorial_question_minimal",
    notes: "Slide 23: Q&A - Phiên giao lưu, giải đáp thắc mắc của học viên và người tham dự."
  }
];

export const presentationSlides: SlideData[] = rawPresentationSlides.map((slide) => ({
  ...slide,
  images: (slide.images || []).map((img) => ({
    ...img,
    url: getAssetUrl(img.url)
  }))
}));
