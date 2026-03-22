import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `你是一名资深游戏运营策略顾问，擅长把情绪化、零散的业务描述整理成结构化运营方案。

请基于用户输入，仅输出一个合法 JSON 对象，不要输出 Markdown，不要输出解释，不要包裹代码块。

JSON 结构必须严格符合下面格式：
{
  "summary": {
    "emotionPriority": "一句话描述情绪与优先级",
    "coreRequest": "一句话描述核心诉求",
    "currentPainPoint": "一句话描述当前痛点",
    "coreGoal": "一句话描述核心目标"
  },
  "diagnostics": [
    {
      "title": "诊断标题1",
      "description": "诊断说明1",
      "tone": "warning"
    },
    {
      "title": "诊断标题2",
      "description": "诊断说明2",
      "tone": "neutral"
    }
  ],
  "recommendations": [
    {
      "tag": "方案一 · 推荐",
      "title": "方案标题1",
      "uplift": "例如 15-30%",
      "primaryAudienceTitle": "人群1名称",
      "primaryAudienceBody": "人群1建议",
      "secondaryAudienceTitle": "人群2名称",
      "secondaryAudienceBody": "人群2建议",
      "scenarioRisk": "适用场景与风险",
      "knowledgeRef": "知识库或经验参考"
    },
    {
      "tag": "方案二 · 备选",
      "title": "方案标题2",
      "description": "方案概述2"
    },
    {
      "tag": "方案三 · 备选",
      "title": "方案标题3",
      "description": "方案概述3"
    }
  ]
}

要求：
1. 所有字段都必须有值，不能为空。
2. 内容必须紧扣用户输入，不要套话。
3. 如果信息不足，可以合理推测，但措辞要稳健。
4. recommendations 必须严格返回 3 条，diagnostics 必须严格返回 2 条。`;

function extractJson(rawText: string) {
  const trimmed = rawText.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  return match ? match[0] : '';
}

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    if (!input || !String(input).trim()) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const apiKey = process.env.AIHUBMIX_API_KEY || process.env.NEXT_PUBLIC_AIHUBMIX_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json({ error: '请在环境变量中配置 AIHUBMIX_API_KEY' }, { status: 500 });
    }

    const response = await fetch('https://aihubmix.com/gemini/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n用户输入：\n${String(input).trim()}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AIHubMix strategy API error:', response.status, errorText);
      return NextResponse.json({ error: `AIHubMix API Error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part?.text || '')
        .join('')
        .trim() || '';

    if (!text) {
      console.error('AIHubMix strategy API returned no text:', JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ error: 'AIHubMix 未返回可用文本内容' }, { status: 500 });
    }

    const jsonText = extractJson(text);

    if (!jsonText) {
      console.error('AIHubMix strategy API returned non-JSON text:', text.slice(0, 500));
      return NextResponse.json({ error: 'AIHubMix 返回内容无法解析为结构化结果' }, { status: 500 });
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse AI strategy JSON:', parseError, jsonText.slice(0, 500));
      return NextResponse.json({ error: 'AIHubMix 返回的 JSON 解析失败' }, { status: 500 });
    }

    return NextResponse.json({ data: parsed });
  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
