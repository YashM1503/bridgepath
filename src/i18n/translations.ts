export type LangCode = "en" | "es" | "hi" | "zh" | "pt";

export interface TranslationSet {
  // Landing
  "landing.tagline": string;
  "landing.title": string;
  "landing.subtitle": string;
  "landing.description": string;
  "landing.cta": string;
  "landing.demo": string;
  "landing.stats.time": string;
  "landing.stats.timeLabel": string;
  "landing.stats.pathways": string;
  "landing.stats.pathwaysLabel": string;
  "landing.stats.plan": string;
  "landing.stats.planLabel": string;
  "landing.disclaimer": string;
  "landing.noAccount": string;
  "landing.supporting": string;
  "landing.features.pathways": string;
  "landing.features.pathwaysDesc": string;
  "landing.features.risks": string;
  "landing.features.risksDesc": string;
  "landing.features.plan": string;
  "landing.features.planDesc": string;

  // Navigation
  "nav.pathways": string;
  "nav.risks": string;
  "nav.plan": string;
  "nav.templates": string;
  "nav.resources": string;
  "nav.backHome": string;
  "nav.restart": string;
  "nav.exportPdf": string;
  "nav.exporting": string;

  // Intake
  "intake.title": string;
  "intake.subtitle": string;
  "intake.back": string;
  "intake.continue": string;
  "intake.submit": string;
  "intake.step.origin": string;
  "intake.step.status": string;
  "intake.step.finances": string;
  "intake.step.preferences": string;
  "intake.origin.title": string;
  "intake.origin.desc": string;
  "intake.origin.country": string;
  "intake.origin.countryPlaceholder": string;
  "intake.origin.zip": string;
  "intake.origin.zipHint": string;
  "intake.status.title": string;
  "intake.status.desc": string;
  "intake.status.label": string;
  "intake.status.visa": string;
  "intake.financial.title": string;
  "intake.financial.desc": string;
  "intake.financial.ssn": string;
  "intake.financial.savings": string;
  "intake.financial.currency": string;
  "intake.financial.payroll": string;
  "intake.prefs.title": string;
  "intake.prefs.desc": string;
  "intake.prefs.housing": string;
  "intake.prefs.housingDesc": string;
  "intake.prefs.phone": string;
  "intake.prefs.phoneDesc": string;
  "intake.prefs.sendMoney": string;
  "intake.prefs.sendMoneyDesc": string;
  "intake.prefs.feeSensitivity": string;
  "intake.prefs.language": string;
  "intake.prefs.goal": string;
  "intake.generating": string;
  "intake.generatingDesc": string;

  // Results
  "results.yourPlan": string;
  "results.demoPlan": string;
  "results.disclaimer": string;

  // Demo
  "demo.title": string;
  "demo.desc": string;
  "demo.viewPlan": string;

  // Language prompt
  "lang.detected": string;
  "lang.continueEnglish": string;
  "lang.switchTo": string;

  // Common
  "common.verifyProvider": string;
}

const en: TranslationSet = {
  "landing.tagline": "FINANCIAL ONBOARDING FOR NEWCOMERS TO THE USA",
  "landing.title": "BridgePath",
  "landing.subtitle": "Your first 30 days, handled.",
  "landing.description": "In under 5 minutes, get a personalized banking plan, risk flags, and a 30-day checklist — built for newcomers from India, China, and Latin America.",
  "landing.cta": "Build My Transition Plan",
  "landing.demo": "Try a Demo Profile",
  "landing.stats.time": "< 5 min",
  "landing.stats.timeLabel": "To complete",
  "landing.stats.pathways": "3–4",
  "landing.stats.pathwaysLabel": "Ranked pathways",
  "landing.stats.plan": "30-day",
  "landing.stats.planLabel": "Action plan",
  "landing.disclaimer": "Decision-support tool only. Not financial, legal, tax, or immigration advice. Always verify with providers.",
  "landing.noAccount": "No account required · No advice · Options only · Always verify with providers",
  "landing.supporting": "Supporting newcomers from:",
  "landing.features.pathways": "Guided Pathways",
  "landing.features.pathwaysDesc": "3–4 scored options by Cost, Speed, Access & Risk",
  "landing.features.risks": "Risk Alerts",
  "landing.features.risksDesc": "Corridor-specific warnings and scam alerts with mitigations",
  "landing.features.plan": "30-Day Plan",
  "landing.features.planDesc": "Week-by-week checklist you can check off as you go",

  "nav.pathways": "Pathways",
  "nav.risks": "Risk Flags",
  "nav.plan": "30-Day Plan",
  "nav.templates": "Templates",
  "nav.resources": "Resources",
  "nav.backHome": "← Back to home",
  "nav.restart": "Restart",
  "nav.exportPdf": "Export PDF",
  "nav.exporting": "Exporting…",

  "intake.title": "Build Your Transition Plan",
  "intake.subtitle": "Answer a few questions — we'll generate your personalized 30-day roadmap.",
  "intake.back": "Back",
  "intake.continue": "Continue",
  "intake.submit": "Generate My Plan",
  "intake.step.origin": "Origin",
  "intake.step.status": "Status",
  "intake.step.finances": "Finances",
  "intake.step.preferences": "Preferences",
  "intake.origin.title": "Where are you coming from?",
  "intake.origin.desc": "This helps us tailor pathways to your specific corridor.",
  "intake.origin.country": "Origin Country",
  "intake.origin.countryPlaceholder": "Select your home country",
  "intake.origin.zip": "US Destination ZIP Code",
  "intake.origin.zipHint": "Used to identify relevant local banking options",
  "intake.status.title": "Your immigration status",
  "intake.status.desc": "This determines which financial products are available to you.",
  "intake.status.label": "Your Status",
  "intake.status.visa": "Visa Type",
  "intake.financial.title": "Your financial picture",
  "intake.financial.desc": "No exact amounts needed — ranges help us match you to the right options.",
  "intake.financial.ssn": "SSN / ITIN Status",
  "intake.financial.savings": "Approximate Savings Available (USD)",
  "intake.financial.currency": "Home Currency",
  "intake.financial.payroll": "Payroll Start Date (optional)",
  "intake.prefs.title": "Your situation & preferences",
  "intake.prefs.desc": "These details help us flag risks and prioritize your action plan.",
  "intake.prefs.housing": "I have a US address established",
  "intake.prefs.housingDesc": "Temporary housing, employer housing, or confirmed lease counts",
  "intake.prefs.phone": "I have a US phone number",
  "intake.prefs.phoneDesc": "Required for 2FA on all US bank accounts",
  "intake.prefs.sendMoney": "I plan to send money home regularly",
  "intake.prefs.sendMoneyDesc": "We'll include remittance recommendations and fee comparisons",
  "intake.prefs.feeSensitivity": "Fee Sensitivity",
  "intake.prefs.language": "Language Preference",
  "intake.prefs.goal": "Primary Goal (first 30 days)",
  "intake.generating": "Generating your personalized plan…",
  "intake.generatingDesc": "Analyzing your corridor and profile",

  "results.yourPlan": "Your Onboarding Plan",
  "results.demoPlan": "'s Plan",
  "results.disclaimer": "⚠ General information only — not financial, legal, or immigration advice. Verify all options with providers.",

  "demo.title": "See BridgePath in Action",
  "demo.desc": "Choose a demo profile to see a personalized onboarding plan.",
  "demo.viewPlan": "View Plan",

  "lang.detected": "We detected your language as",
  "lang.continueEnglish": "Continue in English",
  "lang.switchTo": "Switch to",

  "common.verifyProvider": "Verify with provider",
};

const es: TranslationSet = {
  "landing.tagline": "INCORPORACIÓN FINANCIERA PARA RECIÉN LLEGADOS A EE.UU.",
  "landing.title": "BridgePath",
  "landing.subtitle": "Tus primeros 30 días, resueltos.",
  "landing.description": "En menos de 5 minutos, obtén un plan bancario personalizado, alertas de riesgo y una lista de tareas de 30 días — diseñado para recién llegados de India, China y América Latina.",
  "landing.cta": "Crear Mi Plan de Transición",
  "landing.demo": "Probar un Perfil Demo",
  "landing.stats.time": "< 5 min",
  "landing.stats.timeLabel": "Para completar",
  "landing.stats.pathways": "3–4",
  "landing.stats.pathwaysLabel": "Rutas clasificadas",
  "landing.stats.plan": "30 días",
  "landing.stats.planLabel": "Plan de acción",
  "landing.disclaimer": "Solo herramienta de apoyo. No es asesoría financiera, legal, fiscal o migratoria. Siempre verifique con proveedores.",
  "landing.noAccount": "Sin cuenta · Sin asesoramiento · Solo opciones · Verifique siempre",
  "landing.supporting": "Apoyando a recién llegados de:",
  "landing.features.pathways": "Rutas Guiadas",
  "landing.features.pathwaysDesc": "3–4 opciones puntuadas por Costo, Velocidad, Acceso y Riesgo",
  "landing.features.risks": "Alertas de Riesgo",
  "landing.features.risksDesc": "Advertencias específicas por corredor y alertas de estafas",
  "landing.features.plan": "Plan de 30 Días",
  "landing.features.planDesc": "Lista semanal que puedes ir marcando",

  "nav.pathways": "Rutas",
  "nav.risks": "Riesgos",
  "nav.plan": "Plan 30 Días",
  "nav.templates": "Plantillas",
  "nav.resources": "Recursos",
  "nav.backHome": "← Volver al inicio",
  "nav.restart": "Reiniciar",
  "nav.exportPdf": "Exportar PDF",
  "nav.exporting": "Exportando…",

  "intake.title": "Crea Tu Plan de Transición",
  "intake.subtitle": "Responde algunas preguntas — generaremos tu hoja de ruta personalizada de 30 días.",
  "intake.back": "Atrás",
  "intake.continue": "Continuar",
  "intake.submit": "Generar Mi Plan",
  "intake.step.origin": "Origen",
  "intake.step.status": "Estado",
  "intake.step.finances": "Finanzas",
  "intake.step.preferences": "Preferencias",
  "intake.origin.title": "¿De dónde vienes?",
  "intake.origin.desc": "Esto nos ayuda a adaptar las rutas a tu corredor específico.",
  "intake.origin.country": "País de Origen",
  "intake.origin.countryPlaceholder": "Selecciona tu país",
  "intake.origin.zip": "Código Postal de Destino en EE.UU.",
  "intake.origin.zipHint": "Para identificar opciones bancarias locales",
  "intake.status.title": "Tu estado migratorio",
  "intake.status.desc": "Esto determina qué productos financieros están disponibles para ti.",
  "intake.status.label": "Tu Estado",
  "intake.status.visa": "Tipo de Visa",
  "intake.financial.title": "Tu situación financiera",
  "intake.financial.desc": "No se necesitan montos exactos — los rangos nos ayudan a encontrar las mejores opciones.",
  "intake.financial.ssn": "Estado de SSN / ITIN",
  "intake.financial.savings": "Ahorros Aproximados (USD)",
  "intake.financial.currency": "Moneda de Origen",
  "intake.financial.payroll": "Fecha de Inicio de Nómina (opcional)",
  "intake.prefs.title": "Tu situación y preferencias",
  "intake.prefs.desc": "Estos detalles nos ayudan a identificar riesgos y priorizar tu plan.",
  "intake.prefs.housing": "Tengo dirección en EE.UU.",
  "intake.prefs.housingDesc": "Vivienda temporal, del empleador o contrato confirmado",
  "intake.prefs.phone": "Tengo número de teléfono de EE.UU.",
  "intake.prefs.phoneDesc": "Necesario para 2FA en cuentas bancarias",
  "intake.prefs.sendMoney": "Planeo enviar dinero a casa regularmente",
  "intake.prefs.sendMoneyDesc": "Incluiremos recomendaciones de remesas",
  "intake.prefs.feeSensitivity": "Sensibilidad a Tarifas",
  "intake.prefs.language": "Preferencia de Idioma",
  "intake.prefs.goal": "Meta Principal (primeros 30 días)",
  "intake.generating": "Generando tu plan personalizado…",
  "intake.generatingDesc": "Analizando tu corredor y perfil",

  "results.yourPlan": "Tu Plan de Incorporación",
  "results.demoPlan": " — Plan",
  "results.disclaimer": "⚠ Solo información general — no es asesoría financiera, legal o migratoria. Verifique todas las opciones.",

  "demo.title": "Ve BridgePath en Acción",
  "demo.desc": "Elige un perfil demo para ver un plan personalizado.",
  "demo.viewPlan": "Ver Plan",

  "lang.detected": "Detectamos tu idioma como",
  "lang.continueEnglish": "Continuar en Inglés",
  "lang.switchTo": "Cambiar a",

  "common.verifyProvider": "Verificar con proveedor",
};

const hi: TranslationSet = {
  "landing.tagline": "अमेरिका में नए लोगों के लिए वित्तीय ऑनबोर्डिंग",
  "landing.title": "BridgePath",
  "landing.subtitle": "आपके पहले 30 दिन, व्यवस्थित।",
  "landing.description": "5 मिनट से कम में, एक व्यक्तिगत बैंकिंग योजना, जोखिम चेतावनियाँ, और 30-दिन की चेकलिस्ट प्राप्त करें — भारत, चीन और लैटिन अमेरिका के नए लोगों के लिए।",
  "landing.cta": "मेरी ट्रांज़िशन योजना बनाएं",
  "landing.demo": "डेमो प्रोफ़ाइल आज़माएं",
  "landing.stats.time": "< 5 मिनट",
  "landing.stats.timeLabel": "पूरा करने में",
  "landing.stats.pathways": "3–4",
  "landing.stats.pathwaysLabel": "रैंक किए गए रास्ते",
  "landing.stats.plan": "30-दिन",
  "landing.stats.planLabel": "कार्य योजना",
  "landing.disclaimer": "केवल निर्णय-सहायता उपकरण। वित्तीय, कानूनी, कर या आव्रजन सलाह नहीं। हमेशा प्रदाताओं से सत्यापित करें।",
  "landing.noAccount": "खाते की आवश्यकता नहीं · कोई सलाह नहीं · केवल विकल्प",
  "landing.supporting": "इन देशों के नए लोगों का समर्थन:",
  "landing.features.pathways": "मार्गदर्शित रास्ते",
  "landing.features.pathwaysDesc": "लागत, गति, पहुँच और जोखिम के अनुसार 3–4 विकल्प",
  "landing.features.risks": "जोखिम अलर्ट",
  "landing.features.risksDesc": "कॉरिडोर-विशिष्ट चेतावनियाँ और धोखाधड़ी अलर्ट",
  "landing.features.plan": "30-दिन की योजना",
  "landing.features.planDesc": "साप्ताहिक चेकलिस्ट जिसे आप पूरा कर सकते हैं",

  "nav.pathways": "रास्ते",
  "nav.risks": "जोखिम",
  "nav.plan": "30-दिन योजना",
  "nav.templates": "टेम्पलेट",
  "nav.resources": "संसाधन",
  "nav.backHome": "← वापस होम पर",
  "nav.restart": "पुनः आरंभ",
  "nav.exportPdf": "PDF निर्यात",
  "nav.exporting": "निर्यात हो रहा है…",

  "intake.title": "अपनी ट्रांज़िशन योजना बनाएं",
  "intake.subtitle": "कुछ सवालों का जवाब दें — हम आपका 30-दिन का रोडमैप तैयार करेंगे।",
  "intake.back": "पीछे",
  "intake.continue": "आगे बढ़ें",
  "intake.submit": "मेरी योजना बनाएं",
  "intake.step.origin": "मूल",
  "intake.step.status": "स्थिति",
  "intake.step.finances": "वित्त",
  "intake.step.preferences": "प्राथमिकताएं",
  "intake.origin.title": "आप कहाँ से आ रहे हैं?",
  "intake.origin.desc": "यह हमें आपके कॉरिडोर के अनुसार रास्ते तैयार करने में मदद करता है।",
  "intake.origin.country": "मूल देश",
  "intake.origin.countryPlaceholder": "अपना देश चुनें",
  "intake.origin.zip": "अमेरिका का गंतव्य ZIP कोड",
  "intake.origin.zipHint": "स्थानीय बैंकिंग विकल्पों की पहचान के लिए",
  "intake.status.title": "आपकी आव्रजन स्थिति",
  "intake.status.desc": "यह निर्धारित करता है कि कौन से वित्तीय उत्पाद आपके लिए उपलब्ध हैं।",
  "intake.status.label": "आपकी स्थिति",
  "intake.status.visa": "वीज़ा प्रकार",
  "intake.financial.title": "आपकी वित्तीय स्थिति",
  "intake.financial.desc": "सटीक राशि की आवश्यकता नहीं — श्रेणियाँ हमें सही विकल्प खोजने में मदद करती हैं।",
  "intake.financial.ssn": "SSN / ITIN स्थिति",
  "intake.financial.savings": "अनुमानित बचत (USD)",
  "intake.financial.currency": "घरेलू मुद्रा",
  "intake.financial.payroll": "पेरोल आरंभ तिथि (वैकल्पिक)",
  "intake.prefs.title": "आपकी स्थिति और प्राथमिकताएं",
  "intake.prefs.desc": "ये विवरण हमें जोखिमों की पहचान करने और योजना को प्राथमिकता देने में मदद करते हैं।",
  "intake.prefs.housing": "मेरे पास अमेरिका में पता है",
  "intake.prefs.housingDesc": "अस्थायी आवास या पुष्टि किया गया पट्टा",
  "intake.prefs.phone": "मेरे पास अमेरिकी फ़ोन नंबर है",
  "intake.prefs.phoneDesc": "बैंक खातों पर 2FA के लिए आवश्यक",
  "intake.prefs.sendMoney": "मैं नियमित रूप से घर पैसे भेजने की योजना बना रहा हूँ",
  "intake.prefs.sendMoneyDesc": "हम रेमिटेंस अनुशंसाएं शामिल करेंगे",
  "intake.prefs.feeSensitivity": "शुल्क संवेदनशीलता",
  "intake.prefs.language": "भाषा प्राथमिकता",
  "intake.prefs.goal": "प्राथमिक लक्ष्य (पहले 30 दिन)",
  "intake.generating": "आपकी व्यक्तिगत योजना तैयार हो रही है…",
  "intake.generatingDesc": "आपके कॉरिडोर और प्रोफ़ाइल का विश्लेषण",

  "results.yourPlan": "आपकी ऑनबोर्डिंग योजना",
  "results.demoPlan": " की योजना",
  "results.disclaimer": "⚠ केवल सामान्य जानकारी — वित्तीय, कानूनी या आव्रजन सलाह नहीं।",

  "demo.title": "BridgePath को कार्रवाई में देखें",
  "demo.desc": "व्यक्तिगत योजना देखने के लिए एक डेमो प्रोफ़ाइल चुनें।",
  "demo.viewPlan": "योजना देखें",

  "lang.detected": "आपकी भाषा पहचानी गई",
  "lang.continueEnglish": "अंग्रेजी में जारी रखें",
  "lang.switchTo": "बदलें",

  "common.verifyProvider": "प्रदाता से सत्यापित करें",
};

const zh: TranslationSet = {
  "landing.tagline": "面向美国新移民的金融入门指导",
  "landing.title": "BridgePath",
  "landing.subtitle": "您的前30天，一切安排妥当。",
  "landing.description": "不到5分钟，获得个性化银行计划、风险提示和30天清单——专为来自印度、中国和拉丁美洲的新移民设计。",
  "landing.cta": "创建我的过渡计划",
  "landing.demo": "试用演示档案",
  "landing.stats.time": "< 5 分钟",
  "landing.stats.timeLabel": "完成时间",
  "landing.stats.pathways": "3–4",
  "landing.stats.pathwaysLabel": "排名路径",
  "landing.stats.plan": "30天",
  "landing.stats.planLabel": "行动计划",
  "landing.disclaimer": "仅为决策支持工具。非金融、法律、税务或移民建议。请始终与提供商核实。",
  "landing.noAccount": "无需账户 · 无建议 · 仅选项 · 请与提供商核实",
  "landing.supporting": "支持来自以下国家的新移民：",
  "landing.features.pathways": "引导路径",
  "landing.features.pathwaysDesc": "按成本、速度、可及性和风险评分的3-4个选项",
  "landing.features.risks": "风险警报",
  "landing.features.risksDesc": "特定通道的警告和诈骗提示",
  "landing.features.plan": "30天计划",
  "landing.features.planDesc": "每周清单，可逐项完成",

  "nav.pathways": "路径",
  "nav.risks": "风险",
  "nav.plan": "30天计划",
  "nav.templates": "模板",
  "nav.resources": "资源",
  "nav.backHome": "← 返回首页",
  "nav.restart": "重新开始",
  "nav.exportPdf": "导出PDF",
  "nav.exporting": "导出中…",

  "intake.title": "创建您的过渡计划",
  "intake.subtitle": "回答几个问题——我们将为您生成个性化的30天路线图。",
  "intake.back": "返回",
  "intake.continue": "继续",
  "intake.submit": "生成我的计划",
  "intake.step.origin": "来源",
  "intake.step.status": "身份",
  "intake.step.finances": "财务",
  "intake.step.preferences": "偏好",
  "intake.origin.title": "您从哪里来？",
  "intake.origin.desc": "这有助于我们为您的特定通道定制路径。",
  "intake.origin.country": "来源国",
  "intake.origin.countryPlaceholder": "选择您的国家",
  "intake.origin.zip": "美国目的地邮编",
  "intake.origin.zipHint": "用于识别当地银行选项",
  "intake.status.title": "您的移民身份",
  "intake.status.desc": "这决定了哪些金融产品可供您使用。",
  "intake.status.label": "您的身份",
  "intake.status.visa": "签证类型",
  "intake.financial.title": "您的财务状况",
  "intake.financial.desc": "不需要确切金额——范围有助于我们匹配合适的选项。",
  "intake.financial.ssn": "SSN / ITIN 状态",
  "intake.financial.savings": "大致储蓄（美元）",
  "intake.financial.currency": "本国货币",
  "intake.financial.payroll": "工资开始日期（可选）",
  "intake.prefs.title": "您的情况和偏好",
  "intake.prefs.desc": "这些细节有助于我们识别风险并确定行动计划的优先级。",
  "intake.prefs.housing": "我有美国地址",
  "intake.prefs.housingDesc": "临时住所或已确认的租约",
  "intake.prefs.phone": "我有美国电话号码",
  "intake.prefs.phoneDesc": "银行账户2FA所需",
  "intake.prefs.sendMoney": "我计划定期汇款回国",
  "intake.prefs.sendMoneyDesc": "我们将包含汇款建议",
  "intake.prefs.feeSensitivity": "费用敏感度",
  "intake.prefs.language": "语言偏好",
  "intake.prefs.goal": "主要目标（前30天）",
  "intake.generating": "正在生成您的个性化计划…",
  "intake.generatingDesc": "分析您的通道和档案",

  "results.yourPlan": "您的入门计划",
  "results.demoPlan": "的计划",
  "results.disclaimer": "⚠ 仅为一般信息——非金融、法律或移民建议。请与提供商核实。",

  "demo.title": "查看BridgePath演示",
  "demo.desc": "选择一个演示档案，查看个性化入门计划。",
  "demo.viewPlan": "查看计划",

  "lang.detected": "检测到您的语言为",
  "lang.continueEnglish": "继续使用英语",
  "lang.switchTo": "切换到",

  "common.verifyProvider": "请与提供商核实",
};

const pt: TranslationSet = {
  "landing.tagline": "INTEGRAÇÃO FINANCEIRA PARA RECÉM-CHEGADOS AOS EUA",
  "landing.title": "BridgePath",
  "landing.subtitle": "Seus primeiros 30 dias, resolvidos.",
  "landing.description": "Em menos de 5 minutos, obtenha um plano bancário personalizado, alertas de risco e um checklist de 30 dias — feito para recém-chegados da Índia, China e América Latina.",
  "landing.cta": "Criar Meu Plano de Transição",
  "landing.demo": "Experimentar Perfil Demo",
  "landing.stats.time": "< 5 min",
  "landing.stats.timeLabel": "Para completar",
  "landing.stats.pathways": "3–4",
  "landing.stats.pathwaysLabel": "Caminhos classificados",
  "landing.stats.plan": "30 dias",
  "landing.stats.planLabel": "Plano de ação",
  "landing.disclaimer": "Apenas ferramenta de apoio. Não é aconselhamento financeiro, jurídico, fiscal ou imigratório. Sempre verifique com os provedores.",
  "landing.noAccount": "Sem conta · Sem aconselhamento · Apenas opções · Verifique sempre",
  "landing.supporting": "Apoiando recém-chegados de:",
  "landing.features.pathways": "Caminhos Guiados",
  "landing.features.pathwaysDesc": "3–4 opções pontuadas por Custo, Velocidade, Acesso e Risco",
  "landing.features.risks": "Alertas de Risco",
  "landing.features.risksDesc": "Avisos específicos por corredor e alertas de golpes",
  "landing.features.plan": "Plano de 30 Dias",
  "landing.features.planDesc": "Checklist semanal que você pode completar",

  "nav.pathways": "Caminhos",
  "nav.risks": "Riscos",
  "nav.plan": "Plano 30 Dias",
  "nav.templates": "Modelos",
  "nav.resources": "Recursos",
  "nav.backHome": "← Voltar ao início",
  "nav.restart": "Reiniciar",
  "nav.exportPdf": "Exportar PDF",
  "nav.exporting": "Exportando…",

  "intake.title": "Crie Seu Plano de Transição",
  "intake.subtitle": "Responda algumas perguntas — geraremos seu roteiro personalizado de 30 dias.",
  "intake.back": "Voltar",
  "intake.continue": "Continuar",
  "intake.submit": "Gerar Meu Plano",
  "intake.step.origin": "Origem",
  "intake.step.status": "Status",
  "intake.step.finances": "Finanças",
  "intake.step.preferences": "Preferências",
  "intake.origin.title": "De onde você vem?",
  "intake.origin.desc": "Isso nos ajuda a adaptar os caminhos ao seu corredor específico.",
  "intake.origin.country": "País de Origem",
  "intake.origin.countryPlaceholder": "Selecione seu país",
  "intake.origin.zip": "CEP de Destino nos EUA",
  "intake.origin.zipHint": "Para identificar opções bancárias locais",
  "intake.status.title": "Seu status imigratório",
  "intake.status.desc": "Isso determina quais produtos financeiros estão disponíveis para você.",
  "intake.status.label": "Seu Status",
  "intake.status.visa": "Tipo de Visto",
  "intake.financial.title": "Sua situação financeira",
  "intake.financial.desc": "Não são necessários valores exatos — faixas nos ajudam a encontrar as melhores opções.",
  "intake.financial.ssn": "Status do SSN / ITIN",
  "intake.financial.savings": "Economias Aproximadas (USD)",
  "intake.financial.currency": "Moeda de Origem",
  "intake.financial.payroll": "Data de Início do Salário (opcional)",
  "intake.prefs.title": "Sua situação e preferências",
  "intake.prefs.desc": "Esses detalhes nos ajudam a identificar riscos e priorizar seu plano.",
  "intake.prefs.housing": "Tenho endereço nos EUA",
  "intake.prefs.housingDesc": "Moradia temporária ou contrato confirmado",
  "intake.prefs.phone": "Tenho número de telefone dos EUA",
  "intake.prefs.phoneDesc": "Necessário para 2FA em contas bancárias",
  "intake.prefs.sendMoney": "Planejo enviar dinheiro para casa regularmente",
  "intake.prefs.sendMoneyDesc": "Incluiremos recomendações de remessa",
  "intake.prefs.feeSensitivity": "Sensibilidade a Taxas",
  "intake.prefs.language": "Preferência de Idioma",
  "intake.prefs.goal": "Objetivo Principal (primeiros 30 dias)",
  "intake.generating": "Gerando seu plano personalizado…",
  "intake.generatingDesc": "Analisando seu corredor e perfil",

  "results.yourPlan": "Seu Plano de Integração",
  "results.demoPlan": " — Plano",
  "results.disclaimer": "⚠ Apenas informação geral — não é aconselhamento financeiro, jurídico ou imigratório.",

  "demo.title": "Veja o BridgePath em Ação",
  "demo.desc": "Escolha um perfil demo para ver um plano personalizado.",
  "demo.viewPlan": "Ver Plano",

  "lang.detected": "Detectamos seu idioma como",
  "lang.continueEnglish": "Continuar em Inglês",
  "lang.switchTo": "Mudar para",

  "common.verifyProvider": "Verifique com o provedor",
};

export const TRANSLATIONS: Record<LangCode, TranslationSet> = { en, es, hi, zh, pt };

export const LANGUAGE_NAMES: Record<LangCode, string> = {
  en: "English",
  es: "Español",
  hi: "हिन्दी",
  zh: "中文",
  pt: "Português",
};

export const LANGUAGE_FLAGS: Record<LangCode, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  hi: "🇮🇳",
  zh: "🇨🇳",
  pt: "🇧🇷",
};

export function detectLanguage(): LangCode {
  const browserLang = navigator.language?.slice(0, 2)?.toLowerCase();
  const map: Record<string, LangCode> = { en: "en", es: "es", hi: "hi", zh: "zh", pt: "pt" };
  return map[browserLang] ?? "en";
}
