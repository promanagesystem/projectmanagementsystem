import React from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        client: "",
        description: "",
        nilai_budget: "",
        start_date: "",
        end_date: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("projects.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Create Project" />
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12">
                <div className="max-w-3xl mx-auto px-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">
                            ✨ Create New Project
                        </h1>
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route("projects.index"))}
                            className="border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            ← Back
                        </Button>
                    </div>

                    {/* Card Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 space-y-6 transition-all duration-300"
                    >
                        {/* Project Name */}
                        <div>
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
                                placeholder="Enter project name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Client */}
                        <div>
                            <Label htmlFor="client">Client</Label>
                            <Input
                                id="client"
                                value={data.client}
                                onChange={(e) => setData("client", e.target.value)}
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
                                placeholder="Enter client name"
                            />
                            <InputError message={errors.client} className="mt-2" />
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500 transition-all"
                                rows={4}
                                placeholder="Describe this project..."
                            />
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        {/* Nilai Budget */}
                        <div>
                            <Label htmlFor="nilai_budget">Nilai Budget</Label>
                            <Input
                                id="nilai_budget"
                                value={data.nilai_budget}
                                onChange={(e) =>
                                    setData("nilai_budget", e.target.value)
                                }
                                className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
                                placeholder="Enter budget value"
                            />
                            <InputError
                                message={errors.nilai_budget}
                                className="mt-2"
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input
                                    type="date"
                                    id="start_date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
                                />
                                <InputError
                                    message={errors.start_date}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input
                                    type="date"
                                    id="end_date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
                                />
                                <InputError
                                    message={errors.end_date}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 hover:scale-[1.02]"
                            >
                                {processing ? "Saving..." : "Save Project"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
