import * as Dialog from "@radix-ui/react-dialog"
import { CloseButton, Content, Overlay, TransactionsType, TransactionsTypeButton } from "./styles"
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react"
import * as z from 'zod'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TransactionsContext } from "../../contexts/TransactionsContext"
import { useContext } from "react"

const newTransactionsFormSchema = z.object({
    description: z.string(),
    price: z.number(),
    category: z.string(),
    type: z.enum(['income', 'outcome']),
})

type newTransactionsFormInputs = z.infer<typeof newTransactionsFormSchema>

export function NewTransactionsModal() {
    const { createTransaction } = useContext(TransactionsContext)

    const { 
        control,
        register, 
        handleSubmit, 
        formState: { isSubmitting },
        reset 
    } = useForm<newTransactionsFormInputs>({
        resolver: zodResolver(newTransactionsFormSchema),
        defaultValues: {
            type: 'income'
        }
    })

    async function handleCreateNewTransaction(data: newTransactionsFormInputs) {
        const { description, price, category, type } = data;
        
        await createTransaction({
            description,
            price,
            category,
            type,
        })

        reset();
    }

    return (
        <Dialog.Portal>  {/* Conteúdo que será renderizado no modal */}
            <Overlay /> {/* Adiciona um fundo cinza */}

            <Content>
                <Dialog.Title>Nova transação</Dialog.Title>
                
                <CloseButton>
                    <X size={24}/>
                </CloseButton>

                <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
                    <input 
                        type="text" 
                        placeholder="Descrição" 
                        required
                        {...register('description')}
                    />

                    <input 
                        type="number
                        " placeholder="Preço" 
                        required 
                        {...register('price', {valueAsNumber: true })}
                    />

                    <input 
                        type="text" 
                        placeholder="Categoria" 
                        required
                        {...register('category')}
                    />

                    <Controller 
                        control = {control}
                        name="type"
                        render={({ field }) => {
                            return (
                                <TransactionsType onValueChange={field.onChange} value={field.value}>
                                    <TransactionsTypeButton variant="income" value="income">
                                        <ArrowCircleUp size={24}/>
                                        Entrada
                                    </TransactionsTypeButton>

                                    <TransactionsTypeButton variant="outcome" value="outcome">
                                        <ArrowCircleDown size={24} />
                                        Saída    
                                    </TransactionsTypeButton>
                                </TransactionsType>
                            )
                        }}
                    />

                    <button type="submit" disabled={ isSubmitting }>
                        Cadastrar
                    </button>
                </form>
            </Content>
        </Dialog.Portal>
    )
}