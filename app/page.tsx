"use client";
import { useState } from "react";
import SceneTemplate from "./global/components/SceneTemplate";
import type { Message } from "./global/components/MailConversation";

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

const initialMailConvo: Message[] = [
    {
        id: 1,
        sender: "hr@velsymedia.com",
        senderName: "HR Team",
        recipient: "you@velsymedia.com",
        recipientName: "You",
        timestamp: new Date().toLocaleDateString(),
        body: `Welcome to VelsyMedia! 

We're excited to have you join our development team. Your onboarding process will help you get familiar with our development environment and workflow.

Please complete the initial setup tasks and let us know if you have any questions.

Best regards,
HR Team`,
        attachments: [],
        isFromMe: false,
    },
];

function HomePage() {
    const [mailConvo, setMailConvo] = useState<Message[]>(initialMailConvo);

    const addNewMail = (newMail: Message) => {
        setMailConvo(prev => [...prev, newMail]);
    };

    const handleTaskComplete = () => {
        // Example: Add a new mail when task is completed
        const newMail: Message = {
            id: Date.now(),
            sender: "supervisor@velsymedia.com",
            senderName: "Supervisor",
            recipient: "you@velsymedia.com",
            recipientName: "You",
            timestamp: new Date().toLocaleDateString(),
            body: `Great job on completing the onboarding! 

Your next assignment will be sent shortly. Keep up the excellent work!

Best regards,
Development Team Supervisor`,
            attachments: [],
            isFromMe: false,
        };
        addNewMail(newMail);
    };

    return (
        <SceneTemplate
            storyEntries={storyEntries}
            requirementsMarkdown={requirementsMarkdown}
            title="VelsyMedia Onboarding"
            objective="Complete your initial onboarding by providing your basic information and experience details."
            mailConversation={mailConvo}
            onAddMail={addNewMail}
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-700">
                    Welcome to your first day at VelsyMedia!
                </p>
                <p className="text-sm text-gray-600">
                    Check your mail for further instructions and updates from the HR team.
                </p>
                <button
                    onClick={handleTaskComplete}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <span>Complete Task</span>
                </button>
            </div>
        </SceneTemplate>
    );
}

export default HomePage;