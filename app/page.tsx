
import SceneTemplate from "./global/components/SceneTemplate";

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

function HomePage() {
    return (
        <SceneTemplate
            storyEntries={storyEntries}
            requirementsMarkdown={requirementsMarkdown}
            title="VelsyMedia Onboarding"
            objective="Complete your initial onboarding by providing your basic information and experience details."
        >
            <p className="text-sm text-gray-700 mb-4">
                Welcome to your first day at VelsyMedia!
            </p>
        </SceneTemplate>
    );
}

export default HomePage;