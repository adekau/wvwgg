'use client';
import { ResizablePanel } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Shield } from 'lucide-react';

export default function GuildsPanel({ layout }: { layout: number[] }) {
    return (
        <ResizablePanel className="bg-sidebar" defaultSize={layout[1]} collapsible={true} collapsedSize={0} minSize={22} maxSize={32}>
            <div className="flex items-center px-4 py-2 h-[52px]">
                <h1 className="text-xl font-bold flex">
                    <Shield className="mr-2 pt-1" />
                    <span>Guilds</span>
                </h1>
            </div>
            <Separator className="mb-2" />
            <div className="flex flex-col gap-2 p-4">Guilds sidebar placeholder (WIP)</div>
        </ResizablePanel>
    );
}
