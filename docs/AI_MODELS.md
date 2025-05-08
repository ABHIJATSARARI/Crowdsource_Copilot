# AI Models Reference

This document provides information about the AI models used in the Crowdsource Copilot platform.

## Overview

Crowdsource Copilot leverages advanced generative AI models to provide intelligent assistance throughout the challenge creation process. The platform can be configured to use either Google Gemini or OpenAI models depending on your preferences and requirements.

## AI Provider Options

The platform supports two primary AI providers:

### Google Gemini

**Model Used**: Gemini 2.0 Flash

**Description**: 
Gemini 2.0 Flash is Google's multimodal AI model designed for fast, efficient responses. It's optimized for real-time interactions and can understand and generate content based on textual input. The model has been trained on a diverse dataset and is designed to provide helpful, accurate responses for tasks like summarization, idea generation, content improvements, and structured recommendations.

**Capabilities in Crowdsource Copilot**:
- Challenge description improvement
- Tag suggestion and generation
- Evaluation criteria recommendations
- Prize structure recommendations
- Timeline validation and suggestions
- User assistance and question answering

**Documentation Reference**:
- [Google AI for Developers](https://ai.google.dev/)
- [Google Gemini 2.0 Documentation](https://ai.google.dev/models/gemini)

### OpenAI GPT-4 Turbo

**Model Used**: GPT-4 Turbo

**Description**:
GPT-4 Turbo is OpenAI's advanced large language model that demonstrates strong performance across various natural language tasks. It can understand complex prompts and generate detailed, coherent responses. The model has been trained on a diverse dataset and demonstrates strong capabilities in text generation, summarization, and creative content creation.

**Capabilities in Crowdsource Copilot**:
- Natural language understanding and generation
- Context-aware recommendations
- Detailed explanations and guidance
- Structured output for challenge components
- Chat-based assistance

**Documentation Reference**:
- [OpenAI API Documentation](https://platform.openai.com/docs/introduction)
- [GPT-4 Turbo Model Details](https://platform.openai.com/docs/models/)

## Model Configuration

The backend service for Crowdsource Copilot is designed to work with either AI provider, with the default being Google Gemini. The active provider is configured through the environment variable `AI_PROVIDER` set in the backend `.env` file.

### Configuration Parameters

When using these models, the platform applies the following configuration parameters:

**For Gemini**:
- Temperature: 0.7 (balances creativity and determinism)
- Max Output Tokens: 1024 (controls response length)
- Top-K: 40 (sampling parameter)
- Top-P: 0.95 (nucleus sampling parameter)
- System Instruction: Customized per feature to provide consistent guidance

**For OpenAI**:
- Model: gpt-4-turbo
- Temperature: 0.7
- Max Tokens: 1024
- System Message: Customized per feature

## Data Privacy and Usage

The Crowdsource Copilot platform maintains strict data privacy practices when using these AI models:

1. **No Data Storage by Default**: By default, the platform does not store user interactions with AI models beyond the current session.
2. **API-Based Integration**: All AI features are implemented via API calls to the respective providers.
3. **Minimal Data Transfer**: Only the specific data needed for each AI feature is sent to the AI providers.
4. **Transparent Processing**: The platform clearly indicates when AI is being used to process user input.

## Ethical Considerations

The use of AI models in Crowdsource Copilot follows ethical guidelines:

1. **Human Oversight**: AI suggestions are presented as recommendations, with users maintaining decision-making authority.
2. **Bias Mitigation**: The platform implements practices to reduce bias in AI-generated content.
3. **Transparency**: Users are informed when content is AI-generated or AI-enhanced.
4. **User Control**: All AI-generated content can be edited or rejected by users.

## Alternative Models

The platform's architecture allows for integration with alternative AI models. Organizations with specific requirements can extend the backend service to incorporate:

- Open-source models like LLaMA or Mistral
- Self-hosted AI models
- Domain-specific AI models

Implementation details for alternative models can be found in the backend documentation.