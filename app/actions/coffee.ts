'use server'

import { revalidatePath } from 'next/cache'
import { getSupabase } from '@/lib/supabase'

export async function getCoffees() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('coffees')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function addCoffee(formData: FormData) {
  const supabase = getSupabase()
  const name = formData.get('name') as string
  const roaster = formData.get('roaster') as string
  const mahlgrad = parseFloat(formData.get('mahlgrad') as string)
  const notizen = formData.get('notizen') as string

  const { error } = await supabase.from('coffees').insert({
    name,
    roaster: roaster || null,
    mahlgrad,
    notizen: notizen || null,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function updateCoffee(id: string, formData: FormData) {
  const supabase = getSupabase()
  const name = formData.get('name') as string
  const roaster = formData.get('roaster') as string
  const mahlgrad = parseFloat(formData.get('mahlgrad') as string)
  const notizen = formData.get('notizen') as string

  const { error } = await supabase
    .from('coffees')
    .update({
      name,
      roaster: roaster || null,
      mahlgrad,
      notizen: notizen || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
}

export async function deleteCoffee(id: string) {
  const supabase = getSupabase()
  const { error } = await supabase.from('coffees').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/')
}
