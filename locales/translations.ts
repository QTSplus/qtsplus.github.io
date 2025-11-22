export const translations = {
  en: {
    // Hero section
    hero: {
      paper: 'Paper',
      code: 'Code',
      dataset: 'Dataset',
      huggingFace: 'Hugging Face',
    },

    // Abstract section
    abstract: {
      title: 'Abstract',
      content1: 'Despite the recent advances in the video understanding ability of multimodal large language models (MLLMs), long video understanding remains a challenge. One of the main issues is that the number of vision tokens grows linearly with video length, which causes an explosion in attention cost, memory, and latency. To solve this challenge, we present',
      content1Bold: 'long video understanding remains a challenge',
      content2: 'Given a text query and video tokens, QTSplus dynamically selects the most important visual evidence for the input text query by (i) scoring visual tokens via cross-attention, (ii) predicting an instance-specific retention budget based on the complexity of the query, and (iii) selecting Top-n tokens. Furthermore, a small re-encoder preserves temporal order using absolute time information. Integrated into Qwen2.5-VL,',
      qtsName: 'Query-aware Token Selector (QTSplus)',
      qtsDescription: 'a lightweight yet powerful visual token selection module that serves as an information gate between the vision encoder and LLMs.',
      highlight: 'QTSplus compresses the vision stream by up to 89%',
      highlightEnd: 'and reduces end-to-end latency by 28% on long videos.',
    },

    // Interactive Pipeline section
    pipeline: {
      sectionTitle: 'Methodology & Architecture',
      sectionDescription: 'serves as an information gate between the vision encoder and LLM. Switch views below to explore the model architecture or the data construction pipeline.',
      archButton: 'Architecture (Inference)',
      dataButton: 'Data Pipeline',

      // Architecture view
      simulationTitle: 'Simulation Context',
      simulationDescription: 'Adjust the input query to see how QTSplus adapts.',
      localQuery: 'Local Query',
      localQueryExample: '(e.g., "What is he holding?")',
      globalQuery: 'Global Query',
      globalQueryExample: '(e.g., "Summarize video")',

      textQuery: 'Text Query',
      videoInput: 'Video Input',
      frozen: 'Frozen',
      tokenizerEmbed: 'Tokenizer + Embed',
      visionEncoder: 'Vision Encoder',
      qtsModule: 'QTSplus Module',

      crossAttentionScoring: 'Cross-Attention Scoring',
      adaptiveBudgetHead: 'Adaptive Budget Head',
      topNGate: 'Top-n Gate',
      lightweightReencoding: 'Lightweight Re-encoding',
      reencodeDescription: 'Inject absolute time pos + Self-Attention',

      llmOutput: 'LLM Output',
      selectingTokens: 'Selecting top relevant tokens',
      specific: 'Specific',
      general: 'General',

      // Data Pipeline view
      sourceDataset: 'ShareGPTVideo',
      sourceDescription: '300k Videos + Captions',
      textTeacher: 'Qwen3-235B (Text Teacher)',
      textTeacherDescription: 'Converts captions into Visual Single-Choice Questions (VSCQ). Generates options and correct answer key.',
      textTeacherOutput: 'Output: QTS-VSCQ1 (855k items)',
      visionTeacher: 'Qwen2.5-VL (Vision Teacher)',
      filteringTitle: 'Filtering:',
      filteringDescription: 'Teacher answers VSCQ1. Keep only if Teacher Answer == Ground Truth.',
      filteringResult: 'Result: QTS-VSCQ2 (Cleaned)',
      generationTitle: 'Generation:',
      generationDescription: 'Teacher generates free-form QA answers.',
      generationResult: 'Result: QTS-VQA',

      trainingTitle: 'Training: Teacher Distillation',
      trainingDescription: 'The student model (QTSplus) is trained to mimic the decisions of the verified Teachers.',
      vscqLoss: 'VSCQ Loss:',
      vscqLossDescription: 'Multiple-choice classification.',
      vqaLoss: 'VQA Loss:',
      vqaLossDescription: 'Sequence-level distillation (Teacher Forcing).',
      classification: 'Classification',
      generation: 'Generation',
    },

    // Metrics section
    metrics: {
      sectionTitle: 'Experimental Results',
      sectionDescription: 'Evaluation on eight long-video understanding benchmarks demonstrates that QTSplus achieves massive compression with near-parity or improved accuracy, especially on temporal tasks.',

      efficiency: 'efficiency',
      accuracy: 'accuracy',
      ablation: 'ablation',

      // Efficiency tab
      tokenScalingTitle: 'Visual Token Scaling',
      tokenScalingDescription: 'Number of visual embeddings vs Input Video Frames',
      baselineLabel: 'Baseline Qwen2.5-VL',
      qtsLabel: 'QTSplus (Ours)',
      frames: 'Frames',

      tokenReduction: '-89% Token Reduction',
      tokenReductionDescription: 'The number of visual embeddings drops from ~180k to ~20k at 600 frames. The slope of growth is drastically reduced, enabling processing of hour-long videos on commodity GPUs.',
      latencyReduction: '28% Latency Reduction',
      latencyReductionDescription: 'Wall-clock inference time on a single A100 GPU drops from ~83s to ~60s for long inputs. The adaptive budget ($\\rho$) ensures tokens are only spent when necessary.',

      // Accuracy tab
      generalBenchmarks: 'General Long-Video Benchmarks',
      nearParity: 'Near-parity performance despite 89% compression.',
      tempCompassTitle: 'TempCompass (Temporal Logic)',
      mvBenchTitle: 'MVBench (Fine-Grained)',
      mvBenchHighlight: 'Better Unexpected Action Detection',

      // Ablation tab
      ablationDescription: 'We compare the full QTSplus (Query-Aware + Re-encode) against UNIF (Uniform Sampling) and nREENC (QTSplus without Re-encoding). The data confirms that temporal re-encoding is vital for tasks involving order and fine-grained action.',
      uniformSamplingTitle: 'Uniform Sampling (UNIF)',
      uniformSamplingDescription: 'Static compression wastes budget on irrelevant frames. Performs consistently worst across all metrics.',
      noReencoderTitle: 'No Re-encoder (nREENC)',
      noReencoderDescription: 'Selects good tokens but loses temporal order information. Struggles with "Order", "Action", and "Counterfactual" tasks.',
      fullQtsTitle: 'Full QTSplus',
      fullQtsDescription: 'Restores temporal coherence via absolute time re-encoding. Achieves state-of-the-art efficiency/accuracy trade-off.',

      uniformSamplingName: 'Uniform Sampling',
      noReencoderName: 'No Re-encoder (Token Select Only)',
      fullQtsName: 'Full QTSplus',
    },

    // Dataset section
    dataset: {
      title: 'Trained on 300k Video-Caption Pairs',
      description: 'We construct long-video QA and single-choice question datasets (QTS-VSCQ, QTS-VQA) via a controlled generation pipeline using Qwen3-235B and Qwen2.5-VL.',
      mcqItems: 'MCQ Items',
      videos: 'Videos',
      compression: 'Compression',
      efficiency: 'Efficiency',
    },

    // Citation section
    citation: {
      title: 'Citation',
    },

    // Footer
    footer: {
      copyright: '© 2025 QTSplus Project. Queen Mary University of London & Collaborators.',
    },
  },

  zh: {
    // Hero section
    hero: {
      paper: '论文',
      code: '代码',
      dataset: '数据集',
      huggingFace: 'Hugging Face',
    },

    // Abstract section
    abstract: {
      title: '摘要',
      content1: '尽管多模态大语言模型（MLLMs）在视频理解能力方面取得了最新进展，但长视频理解仍然是一个挑战。主要问题之一是视觉token的数量随视频长度线性增长，导致注意力成本、内存和延迟激增。为了解决这一挑战，我们提出了',
      content1Bold: '长视频理解仍然是一个挑战',
      content2: '给定文本查询和视频token，QTSplus通过以下方式动态选择输入文本查询的最重要视觉证据：（i）通过交叉注意力对视觉token进行评分，（ii）根据查询的复杂性预测特定实例的保留预算，以及（iii）选择Top-n个token。此外，一个小型重编码器使用绝对时间信息保留时间顺序。集成到Qwen2.5-VL中，',
      qtsName: '查询感知Token选择器（QTSplus）',
      qtsDescription: '一个轻量级但强大的视觉token选择模块，作为视觉编码器和LLM之间的信息门。',
      highlight: 'QTSplus将视觉流压缩高达89%',
      highlightEnd: '并在长视频上减少28%的端到端延迟。',
    },

    // Interactive Pipeline section
    pipeline: {
      sectionTitle: '方法与架构',
      sectionDescription: '作为视觉编码器和LLM之间的信息门。切换下面的视图以探索模型架构或数据构建流程。',
      archButton: '架构（推理）',
      dataButton: '数据流程',

      // Architecture view
      simulationTitle: '模拟环境',
      simulationDescription: '调整输入查询以查看QTSplus如何适应。',
      localQuery: '局部查询',
      localQueryExample: '（例如："他拿着什么？"）',
      globalQuery: '全局查询',
      globalQueryExample: '（例如："总结视频"）',

      textQuery: '文本查询',
      videoInput: '视频输入',
      frozen: '冻结',
      tokenizerEmbed: '分词器 + 嵌入',
      visionEncoder: '视觉编码器',
      qtsModule: 'QTSplus模块',

      crossAttentionScoring: '交叉注意力评分',
      adaptiveBudgetHead: '自适应预算头',
      topNGate: 'Top-n门控',
      lightweightReencoding: '轻量级重编码',
      reencodeDescription: '注入绝对时间位置 + 自注意力',

      llmOutput: 'LLM输出',
      selectingTokens: '选择最相关的token',
      specific: '具体',
      general: '通用',

      // Data Pipeline view
      sourceDataset: 'ShareGPTVideo',
      sourceDescription: '300k视频 + 字幕',
      textTeacher: 'Qwen3-235B（文本教师）',
      textTeacherDescription: '将字幕转换为视觉单选题（VSCQ）。生成选项和正确答案键。',
      textTeacherOutput: '输出：QTS-VSCQ1（855k项）',
      visionTeacher: 'Qwen2.5-VL（视觉教师）',
      filteringTitle: '过滤：',
      filteringDescription: '教师回答VSCQ1。仅当教师答案==真实答案时保留。',
      filteringResult: '结果：QTS-VSCQ2（已清理）',
      generationTitle: '生成：',
      generationDescription: '教师生成自由形式的问答答案。',
      generationResult: '结果：QTS-VQA',

      trainingTitle: '训练：教师蒸馏',
      trainingDescription: '学生模型（QTSplus）被训练来模仿已验证教师的决策。',
      vscqLoss: 'VSCQ损失：',
      vscqLossDescription: '多选分类。',
      vqaLoss: 'VQA损失：',
      vqaLossDescription: '序列级蒸馏（教师强制）。',
      classification: '分类',
      generation: '生成',
    },

    // Metrics section
    metrics: {
      sectionTitle: '实验结果',
      sectionDescription: '在八个长视频理解基准上的评估表明，QTSplus实现了大规模压缩，同时在准确性上接近或有所提高，特别是在时间任务上。',

      efficiency: '效率',
      accuracy: '准确度',
      ablation: '消融实验',

      // Efficiency tab
      tokenScalingTitle: '视觉Token扩展',
      tokenScalingDescription: '视觉嵌入数量与输入视频帧数',
      baselineLabel: '基线 Qwen2.5-VL',
      qtsLabel: 'QTSplus（我们的）',
      frames: '帧数',

      tokenReduction: '-89% Token缩减',
      tokenReductionDescription: '在600帧时，视觉嵌入数量从约18万降至约2万。增长斜率大幅降低，使得在商用GPU上处理小时级视频成为可能。',
      latencyReduction: '28% 延迟缩减',
      latencyReductionDescription: '在单个A100 GPU上的实时推理时间从约83秒降至约60秒（对于长输入）。自适应预算（$\\rho$）确保只在必要时花费token。',

      // Accuracy tab
      generalBenchmarks: '通用长视频基准',
      nearParity: '尽管压缩了89%，性能接近基线。',
      tempCompassTitle: 'TempCompass（时间逻辑）',
      mvBenchTitle: 'MVBench（细粒度）',
      mvBenchHighlight: '更好的意外动作检测',

      // Ablation tab
      ablationDescription: '我们将完整的QTSplus（查询感知 + 重编码）与UNIF（均匀采样）和nREENC（无重编码的QTSplus）进行比较。数据证实，时间重编码对于涉及顺序和细粒度动作的任务至关重要。',
      uniformSamplingTitle: '均匀采样（UNIF）',
      uniformSamplingDescription: '静态压缩在不相关帧上浪费预算。在所有指标上表现最差。',
      noReencoderTitle: '无重编码器（nREENC）',
      noReencoderDescription: '选择好的token但丢失时间顺序信息。在"顺序"、"动作"和"反事实"任务上表现不佳。',
      fullQtsTitle: '完整QTSplus',
      fullQtsDescription: '通过绝对时间重编码恢复时间连贯性。实现最先进的效率/准确度权衡。',

      uniformSamplingName: '均匀采样',
      noReencoderName: '无重编码器（仅Token选择）',
      fullQtsName: '完整QTSplus',
    },

    // Dataset section
    dataset: {
      title: '在30万视频-字幕对上训练',
      description: '我们通过使用Qwen3-235B和Qwen2.5-VL的受控生成流程构建长视频问答和单选题数据集（QTS-VSCQ、QTS-VQA）。',
      mcqItems: '多选题项',
      videos: '视频',
      compression: '压缩率',
      efficiency: '效率',
    },

    // Citation section
    citation: {
      title: '引用',
    },

    // Footer
    footer: {
      copyright: '© 2025 QTSplus项目. Queen Mary University of London 及合作者。',
    },
  },
};

export type TranslationKey = typeof translations.en;
