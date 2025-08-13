# RAG 知识系统原型 (Vue 3 + Parse Server)

本项目是一个基于检索增强生成 (RAG) 模式的智能知识问答系统原型。它允许用户上传文档（如 PDF, Word, Excel 等）作为知识源，并通过一个支持多轮对话记忆的聊天界面进行提问。

该项目采用前后端分离架构，前端使用 Vue 3 构建，后端则巧妙地利用 **Parse Server** 作为一个轻量级、高效的“应用服务器”和“业务流编排器”，负责处理所有非 AI 的通用后端任务。

## 🏛️ 项目架构

本系统的核心设计思想是将**业务逻辑**与**AI核心能力**解耦。Parse Server 不执行具体的 AI 计算，而是作为“指挥中心”，调用外部独立的 AI 服务 API 来完成任务。

```mermaid
graph TD
    subgraph "用户端"
        A[Vue 3 前端]
    end

    subgraph "后端业务层 (本项目核心)"
        B(Parse Server)
        B -- "读/写" --> C[MongoDB 数据库<br/>(存储用户/文件元数据/对话历史)]
    end

    subgraph "外部 AI 服务 (已有的API)"
        D[1. 文档解析服务 API]
        E[2. Embedding/向量搜索 API]
        F[3. 大语言模型 LLM API]
    end

    subgraph "知识入库流程"
        A -- "1. 上传文件" --> B
        B -- "2. 触发Cloud Code" --> D
        D -- "3. 返回文本" --> B
        B -- "4. 调用Embedding API" --> E
    end

    subgraph "问答流程 (带记忆)"
        A -- "5. 发送问题 + conversationId" --> B
        B -- "6. Cloud Code 函数 'askQuestionWithMemory' 启动" --> C
        C -- "7. 读取对话历史" --> B
        B -- "8. 调用向量搜索 API" --> E
        E -- "9. 返回相关知识" --> B
        B -- "10. 整合历史+知识+问题, 调用 LLM" --> F
        F -- "11. 返回最终答案" --> B
        B -- "12. 保存用户问题和AI回答到历史" --> C
        B -- "13. 将答案返回给前端" --> A
    end
```

## ✨ 功能特性

*   **文件上传**：支持图片、PDF、Word、Excel 等多种格式的文件作为知识源。
*   **用户管理**：内置完整的用户注册和登录系统。
*   **对话式问答**：通过聊天界面与知识库进行交互。
*   **对话记忆**：支持多轮对话，AI 能够理解上下文语境。
*   **状态管理**：在 Parse Dashboard 中可以清晰地看到文件上传状态、处理进度和对话历史。

## 🛠️ 技术栈

*   **前端**: [Vue 3](https://vuejs.org/) (使用 Vite)
*   **后端**: [Parse Server](https://parseplatform.org/) (运行于 Node.js)
*   **数据库**: [MongoDB](https://www.mongodb.com/)
*   **核心 AI 能力**: 通过 API 调用的外部服务。

## 🗄️ 核心数据模型 (Parse Server)

我们在 Parse Server 中定义了以下核心数据表 (Class) 来支持对话记忆系统。

### `Conversation` Class
代表一个完整的对话会话。

| 字段名 (Field Name) | 数据类型 (Type)     | 描述                                     |
| ------------------- | ------------------- | ---------------------------------------- |
| `user`              | Pointer -> `_User`  | 将对话关联到具体用户。                   |
| `title`             | String              | 对话的标题，方便前端展示。               |

### `Message` Class
代表会话中的每一条消息。

| 字段名 (Field Name) | 数据类型 (Type)           | 描述                                     |
| ------------------- | ------------------------- | ---------------------------------------- |
| `conversation`      | Pointer -> `Conversation` | **核心关联**，将消息归属于某个会话。     |
| `role`              | String                    | 消息角色: `user` 或 `assistant`。        |
| `content`           | String                    | 消息的具体文本内容。                     |





