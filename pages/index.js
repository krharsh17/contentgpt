import Head from 'next/head'
import {Inter} from 'next/font/google'
import {Button, Divider, Heading, Input, Spinner, Text, Textarea, useToast, VStack} from "@chakra-ui/react";
import {useState} from "react";

const inter = Inter({subsets: ['latin']})

export default function Home() {

    const [title, setTitle] = useState("")
    const [purpose, setPurpose] = useState("")
    const [length, setLength] = useState(0)
    const [articleContent, setArticleContent] = useState("")
    const [isLoading, setIsLoading] = useState("")
    const toast = useToast();

    const sendRequest = () => {
        if (title === "" || purpose === "" || length === 0) {
            toast({
                title: 'Please fill all the details correctly',
                status: 'error',
                duration: 4000,
                isClosable: true,
            })
            return
        }

        setIsLoading(true)

        fetch('/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                title, purpose, length
            })
        })
            .then(r => r.json())
            .then(r => {
                setArticleContent(r.content)
                setIsLoading(false)
            })
            .catch(e => {
                toast({
                    title: JSON.stringify(e),
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
                setIsLoading(false)
            })
    }

    const onTitleChange = ev => setTitle(ev.target.value)
    const onPurposeChange = ev => setPurpose(ev.target.value)
    const onLengthChange = ev => setLength(ev.target.value)

    return (
        <>
            <Head>
                <title>ContentGPT</title>
                <meta name="description" content="Create content using ChatGPT"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <VStack margin={24} spacing={4}>
                <Heading size={'2xl'}>ContentGPT</Heading>
                <Text>Create content using AI ✨</Text>

                <VStack spacing={4} margin={16}>
                    <Heading size={'md'}>Describe your requirements below</Heading>
                    <VStack alignItems={'flex-start'}>
                        <Text>Title of your article</Text>
                        <Input variant={'filled'}
                               placeholder={'5 ways to pet a dog'}
                               required
                               width={500}
                               value={title}
                               onChange={onTitleChange}/>
                    </VStack>

                    <VStack alignItems={'flex-start'}>
                        <Text>Describe the purpose of your article in 2-3 sentences</Text>
                        <Textarea minHeight={24}
                                  variant={'filled'}
                                  value={purpose}
                                  onChange={onPurposeChange}
                                  placeholder={'Dogs are amazing creatures. This article will discuss five different ways in which you can pet a dog to make sure it feels the happiest.'}
                                  required width={500}/>
                    </VStack>

                    <VStack alignItems={'flex-start'}>
                        <Text>Word length for your article</Text>
                        <Input variant={'filled'}
                               placeholder={'Enter something between 200 and 2000'}
                               required
                               value={length}
                               onChange={onLengthChange}
                               width={500}
                               type={'number'}/>
                    </VStack>

                    <VStack>
                        {(isLoading ? <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        /> : <Button colorScheme={'blue'} onClick={sendRequest}>✨ Generate article ✨</Button>)}
                    </VStack>


                </VStack>
                {(articleContent !== "" ? <VStack spacing={4} margin={16}>
                    <Heading size={'md'}>Here's your article</Heading>
                    <Divider/>
                    <VStack alignItems={'flex-start'} width={800}>
                        {articleContent.split("\n").map(line => {
                            switch (line.split(" ")[0]) {
                                case "#":
                                    return <Heading size={'xl'}>{line}</Heading>
                                case "##":
                                    return <Heading size={'lg'}>{line}</Heading>
                                case "###":
                                    return <Heading size={'md'}>{line}</Heading>
                                case "####":
                                    return <Heading size={'sm'}>{line}</Heading>
                                default:
                                    return <Text>{line}</Text>
                            }
                        })}

                    </VStack>
                </VStack> : <div/>)}
            </VStack>
        </>
    )
}
