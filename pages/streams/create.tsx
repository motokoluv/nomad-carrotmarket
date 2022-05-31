import type {NextPage} from "next";
import {useForm} from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import {useEffect} from "react";
import {useRouter} from "next/router";
import TextArea from "@components/textarea";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import {Stream} from "@prisma/client"

interface CreateForm {
    name: string;
    price: number;
    description: string;
}

interface CreateResponse {
    ok: boolean;
    stream: Stream
}

const Create: NextPage = () => {
    const {register, handleSubmit} = useForm<CreateForm>();
    const [createStream, {loading, data}] = useMutation<CreateResponse>(`/api/streams`);
    const onValid = (form: CreateForm) => {
        if (loading) {
            return;
        }
        createStream(
            form
        )
    };

    const router = useRouter();
    useEffect(() => {
        if (data && data.ok) {
            router.replace(`/streams/${data.stream.id}`);
        }
    }, [data, router]);

    return (
        <Layout canGoBack title="Go Live">
            <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
                <Input
                    register={register("name", {required: true})}
                    required label="Name" name="name" type="text"/>
                <Input
                    register={register("price", {required: true})}
                    required
                    label="Price"
                    name="price"
                    type="text"
                    kind="price"
                />
                <TextArea register={register("description")} name="description" label="Description"/>
                <Button text={loading ? "Loading..." : "Go live"}/>
            </form>
        </Layout>
    );
};

export default Create;
