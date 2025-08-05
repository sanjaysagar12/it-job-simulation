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
    const [formData, setFormData] = useState({
        comments: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addNewMail = (newMail: Message) => {
        setMailConvo(prev => [...prev, newMail]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            console.log("Form Data Submitted:", formData);
            
            // Send form data to HR agent for evaluation
            const response = await fetch('/api/agent/hr-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userPrompt: `Here is my onboarding form submission:
                    
Comments/Questions: ${formData.comments || 'No additional comments'}

Please review my submission and let me know if everything looks good or if I need to provide any additional information.`
                })
            });

            const aiResponse = await response.json();
            console.log("AI Response:", aiResponse.convo);
            
            // Create mail based on AI response
            const newMail: Message = {
                id: Date.now(),
                sender: "sarah.mitchell@velsymedia.com",
                senderName: "Sarah Mitchell (HR)",
                recipient: "you@velsymedia.com",
                recipientName: "You",
                timestamp: new Date().toLocaleDateString(),
                body: aiResponse.convo,
                attachments: [],
                isFromMe: false,
            };
            
            addNewMail(newMail);
            
            // Log the evaluation result
            console.log("HR Evaluation Result:", aiResponse.result ? "APPROVED" : "NEEDS IMPROVEMENT");
            console.log("AI Response:", aiResponse.convo);
            
        } catch (error) {
            console.error("Error submitting form:", error);
            
            // Add error mail
            const errorMail: Message = {
                id: Date.now(),
                sender: "system@velsymedia.com",
                senderName: "System",
                recipient: "you@velsymedia.com",
                recipientName: "You",
                timestamp: new Date().toLocaleDateString(),
                body: "There was an error processing your submission. Please try again later or contact IT support.",
                attachments: [],
                isFromMe: false,
            };
            addNewMail(errorMail);
        } finally {
            setIsSubmitting(false);
        }
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
            <div className="space-y-6">
                <p className="text-sm text-gray-700">
                    Welcome to your first day at VelsyMedia!
                </p>
                <p className="text-sm text-gray-600">
                    Check your mail for further instructions and updates from the HR team.
                </p>

                {/* Onboarding Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Onboarding Information</h3>

                    <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                            Comments or Questions for HR
                        </label>
                        <textarea
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Any questions about the onboarding process, company policies, or anything else you'd like to know..."
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                "Submit to HR"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleTaskComplete}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Complete Task
                        </button>
                    </div>
                </form>
            </div>
        </SceneTemplate>
    );
}

export default HomePage;