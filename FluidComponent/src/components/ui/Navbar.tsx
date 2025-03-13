import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquarePlus,
    BrainCircuit,
    Command,
    SquareFunction,
    MousePointerClick,
    BrainCog,
    Type,
    Image,
    Video,
    Music,
    File,
    Keyboard,
    FileText,
    Webhook,
    Cable,
    CircleDot,
    GalleryVertical,
    Braces,
    ChevronsLeftRight,
    Clock,
    Wand,
    Component
} from './icons';

interface NestedOption {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

interface NavItem {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
    nestedOptions?: NestedOption[];
}

const Navbar: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const navItems: NavItem[] = [
        {
            icon: <MousePointerClick size={22} />,
            label: 'Start',
            onClick: () => console.log('Start clicked'),
            active: activeIndex === 0,
            nestedOptions: [
                { icon: <CircleDot size={18} />, label: 'New Project', onClick: () => console.log('New Project') },
                { icon: <FileText size={18} />, label: 'Open Recent', onClick: () => console.log('Open Recent') },
                { icon: <Cable size={18} />, label: 'Connect', onClick: () => console.log('Connect') }
            ]
        },
        {
            icon: <MessageSquarePlus size={22} />,
            label: 'Add Message',
            onClick: () => console.log('Add Message clicked'),
            active: activeIndex === 1,
            nestedOptions: [
                { icon: <Type size={18} />, label: 'Text', onClick: () => console.log('Text') },
                { icon: <Image size={18} />, label: 'Image', onClick: () => console.log('Image') },
                { icon: <Video size={18} />, label: 'Video', onClick: () => console.log('Video') },
                { icon: <Music size={18} />, label: 'Audio', onClick: () => console.log('Audio') }
            ]
        },
        {
            icon: <BrainCircuit size={22} />,
            label: 'Listen',
            onClick: () => console.log('Listen clicked'),
            active: activeIndex === 2,
            nestedOptions: [
                { icon: <Keyboard size={18} />, label: 'Voice to Text', onClick: () => console.log('Voice to Text') },
                { icon: <Webhook size={18} />, label: 'Real-time', onClick: () => console.log('Real-time') },
                { icon: <Clock size={18} />, label: 'History', onClick: () => console.log('History') }
            ]
        },
        {
            icon: <BrainCog size={22} />,
            label: 'AI',
            onClick: () => console.log('AI clicked'),
            active: activeIndex === 3,
            nestedOptions: [
                { icon: <Wand size={18} />, label: 'Generate', onClick: () => console.log('Generate') },
                { icon: <Braces size={18} />, label: 'Code', onClick: () => console.log('Code') },
                { icon: <FileText size={18} />, label: 'Summarize', onClick: () => console.log('Summarize') }
            ]
        },
        {
            icon: <Command size={22} />,
            label: 'Logic',
            onClick: () => console.log('Logic clicked'),
            active: activeIndex === 4,
            nestedOptions: [
                { icon: <ChevronsLeftRight size={18} />, label: 'Flow', onClick: () => console.log('Flow') },
                { icon: <GalleryVertical size={18} />, label: 'Templates', onClick: () => console.log('Templates') },
                { icon: <Component size={18} />, label: 'Custom', onClick: () => console.log('Custom') }
            ]
        },
        {
            icon: <SquareFunction size={22} />,
            label: 'Advance',
            onClick: () => console.log('Advance clicked'),
            active: activeIndex === 5,
            nestedOptions: [
                { icon: <File size={18} />, label: 'Export', onClick: () => console.log('Export') },
                { icon: <Braces size={18} />, label: 'Settings', onClick: () => console.log('Settings') },
                { icon: <Cable size={18} />, label: 'API', onClick: () => console.log('API') }
            ]
        }
    ];

    const activeItem = navItems[activeIndex];

    // Use tween for dimensions to prevent wiggle
    const dimensionTransition = {
        type: "tween",
        ease: "easeInOut",
        duration: 0.2
    };

    // More stable spring with higher damping
    const springTransition = {
        type: "spring",
        stiffness: 180,
        damping: 30,
        mass: 1.2
    };

    // Simplified item variants with less motion
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 5,
            scale: 0.98
        },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.025,
                type: "tween",
                ease: "easeOut",
                duration: 0.15
            }
        })
    };

    return (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
            <div
                className="relative"
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                {/* Dynamic Island */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                        width: isExpanded ? 440 : 140,
                        height: isExpanded ? "auto" : 52
                    }}
                    transition={{
                        y: { ...springTransition, stiffness: 150 },
                        opacity: { duration: 0.2 },
                        width: dimensionTransition,
                        height: dimensionTransition
                    }}
                    className="flex flex-col bg-black/90 backdrop-blur-lg rounded-2xl border border-gray-800 shadow-lg overflow-hidden"
                >
                    {/* Header with active item */}
                    <div className="flex items-center justify-center py-2.5 px-3">
                        <motion.div
                            animate={{
                                scale: isExpanded ? 1.03 : 1
                            }}
                            transition={{
                                scale: dimensionTransition
                            }}
                            className={`flex items-center justify-center px-3.5 py-2 rounded-full 
                                ${isExpanded ? 'bg-white/10' : 'bg-white text-black'}`}
                        >
                            {activeItem.icon}
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{
                                    opacity: isExpanded ? 1 : 0,
                                    width: isExpanded ? "auto" : 0,
                                    marginLeft: isExpanded ? 12 : 0
                                }}
                                transition={dimensionTransition}
                                className="text-sm font-medium text-white whitespace-nowrap overflow-hidden"
                            >
                                {activeItem.label}
                            </motion.span>
                        </motion.div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence mode="wait">
                        {isExpanded && (
                            <motion.div
                                key="expanded-content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    height: dimensionTransition,
                                    opacity: { duration: 0.15 }
                                }}
                                className="px-5 pb-5"
                            >
                                {/* Main navigation items */}
                                <div className="grid grid-cols-6 gap-3.5 mb-5">
                                    {navItems.map((item, idx) => (
                                        <motion.button
                                            key={idx}
                                            custom={idx}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            whileHover={{
                                                scale: 1.05,
                                                transition: { type: "tween", duration: 0.1 }
                                            }}
                                            whileTap={{
                                                scale: 0.98,
                                                transition: { type: "tween", duration: 0.1 }
                                            }}
                                            onClick={() => {
                                                item.onClick();
                                            }}
                                            className={`flex flex-col items-center justify-center py-3 px-1 rounded-xl ${item.active
                                                ? 'bg-white text-black'
                                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {item.icon}
                                            <span className="text-xs mt-2.5 whitespace-nowrap">{item.label}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gray-800 my-4"></div>

                                {/* Nested options for active item */}
                                <div className="grid grid-cols-3 gap-4">
                                    {activeItem.nestedOptions?.map((option, idx) => (
                                        <motion.button
                                            key={idx}
                                            custom={idx + navItems.length}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover={{
                                                scale: 1.03,
                                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                transition: { type: "tween", duration: 0.1 }
                                            }}
                                            whileTap={{
                                                scale: 0.98,
                                                transition: { type: "tween", duration: 0.1 }
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                option.onClick();
                                            }}
                                            className="flex items-center p-3.5 rounded-lg text-gray-300 hover:text-white"
                                        >
                                            <span className="p-1.5">{option.icon}</span>
                                            <span className="text-xs ml-3.5 whitespace-nowrap">{option.label}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Navbar;
