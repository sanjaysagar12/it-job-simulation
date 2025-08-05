"use client";
import SceneTemplate from "./global/components/SceneTemplate";
import type { SceneInputField } from "./global/components/SceneTemplate";

// You'll need to create these content files similar to the GitHub repo structure
const storyEntries = [
    { text: "Welcome to VelsyMedia's IT Job Simulation!" },
    { text: "You've been hired as a Software Developer." },
    { text: "Your first task is to get familiar with our development environment." },
];

const requirementsMarkdown = `
# Getting Started

## Your Mission
- Set up your development environment
- Complete the onboarding tasks
- Submit your initial project setup

## Requirements
1. Follow the instructions carefully
2. Complete all input fields
3. Submit for review
`;

const mailConvo = [
    {
        id: 1,
        sender: "hr@velsymedia.com",
        senderName: "HR Team",
        recipient: "you@velsymedia.com",
        recipientName: "You",
        subject: "Welcome to VelsyMedia!",
        body: "Welcome aboard! Please complete your onboarding tasks.",
        timestamp: new Date().toISOString(),
        attachments: [],
        isFromMe: false,
    },
];

const createUserMail = (inputs: any, mailConvoLength: number) => ({
    id: mailConvoLength + 1,
    sender: "you@velsymedia.com",
    senderName: "You",
    recipient: "hr@velsymedia.com",
    recipientName: "HR Team",
    subject: "Onboarding Completed",
    body: `I have completed the initial setup tasks.`,
    timestamp: new Date().toISOString(),
    attachments: [],
    isFromMe: true,
});

const createReviewMail = async (inputs: any) => [{
    id: mailConvo.length + 2,
    sender: "supervisor@velsymedia.com",
    senderName: "Supervisor",
    recipient: "you@velsymedia.com",
    recipientName: "You",
    subject: "Setup Review",
    body: "Great job on completing the initial setup!",
    timestamp: new Date().toISOString(),
    attachments: [],
    isFromMe: false,
}];

const inputFields: SceneInputField[] = [
    {
        label: "Your Name",
        name: "userName",
        filename: "profile.txt",
        placeholder: "Enter your full name",
        required: true,
        rows: 1,
        description: "Please provide your full name for the profile.",
    },
    {
        label: "Development Experience",
        name: "experience",
        filename: "experience.md",
        placeholder: "Describe your development experience...",
        required: true,
        rows: 4,
        description: "Brief overview of your technical background.",
    },
];

function HomePage() {
    return (
        <SceneTemplate
            storyEntries={storyEntries}
            requirementsMarkdown={requirementsMarkdown}
            mailConvo={mailConvo}
            createUserMail={createUserMail}
            createReviewMail={createReviewMail}
            inputFields={inputFields}
            title="VelsyMedia Onboarding"
            objective="Complete your initial onboarding by providing your basic information and experience details."
            sceneId="scene1"
        >
            <p className="text-sm text-gray-700 mb-4">
                Welcome to your first day at VelsyMedia!
            </p>
        </SceneTemplate>
    );
}

export default HomePage;