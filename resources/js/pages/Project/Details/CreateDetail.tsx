import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

interface Project {
    id: number;
    name: string;
}

export default function CreateDetail({ project }: { project: Project }) {
    const { data, setData, post, processing, errors } = useForm({
        background: '',
        objective: '',
        scope: '',
        technologies: '',
        duration: '',
        timeline: '',
        deliverables: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('projects.details.store', { project: project.id }), {
            onSuccess: () => {
                toast.success(
                    `Detail untuk ${project.name} berhasil disimpan!`,
                );
                setTimeout(() => {
                    window.location.href = route('projects.show', {
                        id: project.id,
                    });
                }, 1000);
            },
            onError: () => toast.error('Gagal menyimpan detail. Coba lagi ya!'),
        });
    };

    return (
        <AppLayout>
            <Head title={`Tambah Detail - ${project.name}`} />
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 lg:px-8"
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Tambah Detail Project:{' '}
                        <span className="text-blue-600">{project.name}</span>
                    </h1>
                    <Link href={route('projects.show', { id: project.id })}>
                        <Button variant="outline">← Kembali</Button>
                    </Link>
                </div>

                <Card className="border border-gray-200 shadow-lg dark:border-gray-800 dark:shadow-gray-900/40">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                            Form Detail Project
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid gap-6 sm:grid-cols-2">
                                {[
                                    {
                                        label: 'Latar Belakang',
                                        name: 'background',
                                        type: 'textarea',
                                    },
                                    {
                                        label: 'Tujuan Project',
                                        name: 'objective',
                                        type: 'textarea',
                                    },
                                    {
                                        label: 'Ruang Lingkup',
                                        name: 'scope',
                                        type: 'textarea',
                                    },
                                    {
                                        label: 'Teknologi',
                                        name: 'technologies',
                                        type: 'input',
                                    },
                                    {
                                        label: 'Durasi',
                                        name: 'duration',
                                        type: 'input',
                                    },
                                    {
                                        label: 'Timeline',
                                        name: 'timeline',
                                        type: 'input',
                                    },
                                    {
                                        label: 'Deliverables',
                                        name: 'deliverables',
                                        type: 'textarea',
                                    },
                                    {
                                        label: 'Catatan Tambahan',
                                        name: 'notes',
                                        type: 'textarea',
                                    },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="mb-1 block font-medium text-gray-800 dark:text-gray-300">
                                            {field.label}
                                        </label>
                                        {field.type === 'textarea' ? (
                                            <Textarea
                                                className="min-h-[100px]"
                                                value={
                                                    data[
                                                        field.name as keyof typeof data
                                                    ]
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        field.name as keyof typeof data,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <Input
                                                value={
                                                    data[
                                                        field.name as keyof typeof data
                                                    ]
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        field.name as keyof typeof data,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        )}
                                        {errors[
                                            field.name as keyof typeof errors
                                        ] && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {
                                                    errors[
                                                        field.name as keyof typeof errors
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="flex justify-end gap-3">
                                <Link
                                    href={route('projects.show', {
                                        id: project.id,
                                    })}
                                >
                                    <Button variant="outline">Batal</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Detail'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </AppLayout>
    );
}
