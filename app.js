const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const path = require('path')
const fs = require('fs')
const menuPath = path.join(__dirname, "mensajes", "texto.txt")
const menu = fs.readFileSync(menuPath, "utf8")
const idiomaPath = path.join(__dirname, "mensajes", "idiomas.txt")
const idioma = fs.readFileSync(idiomaPath, "utf8")
const enlacesPath = path.join(__dirname, "mensajes", "enlaces.txt")
const enlaces = fs.readFileSync(enlacesPath, "utf8")


const flowSecundario =  addKeyword(['1', '2', '3', '4', '5']) 
                        .addAnswer(
                       [ '¡Genial! Dejanos tus datos para registrarlo en nuestro sistema',
                        'Nombre, Rut, Correo'],
                        {
                            capture: true,
                        },
                        async (ctx, { flowDynamic, state }) => {
                            await state.update({ nameu: ctx.body })
                        await flowDynamic('😊Gracias, enseguida un agente te contactara a la brevedad.')
                        }
                        )



const flowTemporal = addKeyword(['5', 'cinco', 'quinto']).addAnswer([
    '1-Consulta estado de trámite',
    '2-Ampliación de certificado de Residencia Temporal en trámite',
    '3-Estampado Electrónico',
    '4-Ratificación de Residencia Temporal otorgada',
    '5-Rectificación de Estampado Electrónico',
    '6-Recurso Administrativo (Residencia Temporal)',
    '7-Residencia Temporal en Chile',
], null, null, [flowSecundario])

const flowNacionalidad = addKeyword(['4']).addAnswer([
    '1-Certificado de nacionalizado',
    '2-Certificado de no nacionalizado',
    '3-Pronunciamiento de nacionalidad',
    '4-Solicitud de carta de Nacionalización',
], null, null, [flowSecundario])

const familiar = addKeyword('3').addAnswer([
     '1-Residenica temporal fuera de Chile para menores de Edad ',
     '2-Residencia temporal fuera de Chile con Vinculo Matrimonial',
     '3-Residencia temporal fuera de Chile para Hijos mayor de 18 años'
], null, null, [flowSecundario])

const flowTurista = addKeyword('2').addAnswer(['1-Autorización de trabajo con Permanencia Transitoria',
    '2-Permanencia Transitoria para ex residentes oficiales',
    '3-Prórroga de Permanencia Transitoria',
    '4-Prórroga de Tarjeta de Tripulante',
], null, null, [flowSecundario])

const flowDefinitiva = addKeyword('1').addAnswer(['1-Consulta estado de trámite',
    '2-Ampliación de certificado de Residencia Definitiva en trámite',
    '3-Rectificación de resolución que otorga la Residencia Definitiva',
    '4-Recurso Administrativo (Residencia Definitiva)',
    '5-Solicitud de Residencia Definitiva',
     
],null, null, [flowSecundario])
const flowTramite = addKeyword(EVENTS.ACTION).addAnswer('*Elige una opción*').addAnswer([
        '1-Permanencia Definitiva',
        '2-Visa Turista',
        '3-Visa Reunificación Familiar',
        '4-Nacionalidad',
        '5-Residencia Temporal',

], null, null, [flowDefinitiva, flowTurista, flowDefinitiva, flowTemporal])




const flowAmericana = addKeyword(EVENTS.ACTION).addAnswer([
    '1-Visa Waiver',
    '2-Esta para Chileno o Nacionalizado',
    '3-Visa EB2'
], null, null, [flowSecundario])

const flowCanada = addKeyword(EVENTS.ACTION).addAnswer([
    '1-Visa Eta para Chileno y Nacionalizado Chileno',
    '2-Visa de Turista para Residente defintivo en Chile',
    '3-Visa de Estudiante calificado',
    '4-Visa de transisto'
], null,null, [flowSecundario])

const flowShengen = addKeyword(EVENTS.ACTION).addAnswer([
    '1-Visa para Francia',
    '2-Visa Italia',
    '3-Visa para Brasil',
    '4-Visa España',
    '5-Visa Portugal'
], null, null, [flowSecundario])

const links = addKeyword(EVENTS.ACTION).addAnswer(enlaces)

const preguntas = addKeyword(EVENTS.ACTION) .addAnswer(
    '¿Cuéntame, que trámite desearía hacer?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state }) => {
        await state.update({ name: ctx.body })
       await flowDynamic('¡Entiendo! Para eso necesitaré tus datos.')
    }
)
.addAnswer(
    '¿Cual es tu Rut, Y tú nombre?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack }) => {
        if (!ctx.body.includes('-')) {
            return fallBack('El rut debe ir en ese formato xxxxxxxx-x y junto al nombre, intente de nuevo')
          }
          else{
            await state.update({ age: ctx.body })
            const myState = state.getMyState()
          
          }
        
    }
)
.addAnswer(
    '¿Cual es tu Correo?',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state, fallBack }) => {
        if (!ctx.body.includes('@')) {
            return fallBack('Email incorrecto')
          }
          else{
            await state.update({ correo: ctx.body })
            const myState = state.getMyState()
        
          }
        
    }
)
.addAnswer( 'Tus datos son ⬇ ', null, async (_, { flowDynamic, state }) => {
    const myState = state.getMyState()
   await flowDynamic(`Trámite: ${myState.name} \n: Rut: ${myState.age}, \nCorreo: ${myState.correo}`)
})
.addAnswer('😊Gracias, enseguida un agente te contactara a la brevedad.')

const flowTraducir = addKeyword(EVENTS.ACTION).addAnswer(idioma)

const menuFlow = addKeyword(["Menu", 'menu', 'hola', 'Hola', 'Buenos días', 'buenos dias'])

.addAnswer(
   
    menu,
    { capture: true },
    async (ctx, { gotoFlow, fallBack, flowDynamic }) => {
        if (!["1", "2", "3", "4", "5","6","7", "0"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no válida, por favor selecciona una de las opciones."
            );
        }
        switch (ctx.body) {
            case "1":
                return gotoFlow(flowTramite);
            case "2":
                return  gotoFlow(flowAmericana);
            case "3": 
                return  gotoFlow(flowCanada);
            case "4":
                return  gotoFlow(flowShengen);
            case "5":
                return  gotoFlow(flowTraducir);
            case "6":
                 return gotoFlow(preguntas);
            case "7":
                 return gotoFlow(links);
            case "0":
                return await flowDynamic(
                    "Saliendo... Puedes volver a acceder a este menú escribiendo '*Menu*'"
                );
        }
    }
);
const notaDeVoz = addKeyword(EVENTS.VOICE_NOTE).addAnswer('Por favor, no recibimos nota de voz. ¡¡Escribe lo que desea!!')
const agradecimientos = addKeyword(['Gracias', ]).addAnswer('¡De nada! 😊 Estoy aquí para ayudarte.')


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([menuFlow, flowTramite, preguntas, agradecimientos])
    const adapterProvider   = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
