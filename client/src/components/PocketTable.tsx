import React from "react";
import { ExternalLink, Tag } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { PocketLink } from "../api/pocketService";

type PocketTableProps = {
    pocketLinks: PocketLink[];
};

const PocketTable: React.FC<PocketTableProps> = ({ pocketLinks }) => {
    
    // Format timestamp to readable date
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="w-full">
            <Table className="text-sm">
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className={cn("w-10 font-medium py-1.5 px-2 text-sm text-left")}>#</TableHead>
                        <TableHead className={cn("w-[35%] font-medium py-1.5 px-2 text-sm text-left")}>Article</TableHead>
                        <TableHead className={cn("w-[15%] font-medium py-1.5 px-2 text-sm text-left")}>Date Added</TableHead>
                        <TableHead className={cn("w-[20%] font-medium py-1.5 px-2 text-sm text-left")}>Tags</TableHead>
                        <TableHead className={cn("w-[10%] font-medium py-1.5 px-2 text-sm text-left")}>Status</TableHead>
                        <TableHead className={cn("w-[10%] font-medium py-1.5 px-2 text-sm text-left")}>Link</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pocketLinks.map((link, index) => (
                        <TableRow key={link.id} className="h-8">
                            <TableCell className={cn("font-medium py-1 px-2 text-sm text-left")}>{index + 1}</TableCell>
                            <TableCell className={cn("py-1 px-2 text-left")}>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-sm font-medium block line-clamp-2"
                                >
                                    {link.title}
                                </a>
                                <div className="text-[10px] text-muted-foreground truncate mt-0.5">{link.url}</div>
                            </TableCell>
                            <TableCell className={cn("text-muted-foreground py-1 px-2 text-sm text-left")}>
                                {formatDate(link.time_added)}
                            </TableCell>
                            <TableCell className={cn("py-1 px-2 text-left")}>
                                {link.tags ? (
                                    <div className="flex flex-wrap gap-1">
                                        {link.tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                                            <Badge key={tagIndex} variant="secondary" className="text-xs py-0 px-1">
                                                <Tag className="h-2 w-2 mr-1" />
                                                {tag.trim()}
                                            </Badge>
                                        ))}
                                        {link.tags.split(',').length > 3 && (
                                            <Badge variant="outline" className="text-xs py-0 px-1">
                                                +{link.tags.split(',').length - 3}
                                            </Badge>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-xs">No tags</span>
                                )}
                            </TableCell>
                            <TableCell className={cn("py-1 px-2 text-left")}>
                                <Badge 
                                    variant={link.status === "unread" ? "default" : "secondary"}
                                    className="text-xs"
                                >
                                    {link.status}
                                </Badge>
                            </TableCell>
                            <TableCell className={cn("py-1 px-2 text-left")}>
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80 transition-colors"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {pocketLinks.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                    No pocket links found.
                </div>
            )}
        </div>
    );
};

export default PocketTable;
