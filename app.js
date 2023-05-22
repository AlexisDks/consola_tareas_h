const colors = require('colors')
const {
    inquirerMenu,
    pausa,
    leerInput,
    listadoTareasBorrar,
    confirmar,
    mostrarListadoChecklist
} = require('./helpers/inquirer')
const Tareas = require('./models/tareas')
const { guardarDB, leerDB } = require('./helpers/guardarArchivo')

const main = async () => {
    let opt = ''
    const tareas = new Tareas()
    const TareasDB = leerDB()

    if (TareasDB) {
        tareas.cargarTareasFromArray(TareasDB)
    }

    do {
        opt = await inquirerMenu()

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción:')
                tareas.crearTarea(desc)
                break
            case '2':
                tareas.listadoCompleto()
                break
            case '3':
                tareas.listarPendientesCompletadas(true)
                break
            case '4':
                tareas.listarPendientesCompletadas(false)
                break
            case '5':
                const ids = await mostrarListadoChecklist(tareas.listadoArray)
                tareas.toggleCompletadas(ids)
                break
            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArray)

                if (id !== '0') {
                    const ok = await confirmar('¿Está seguro?')
                    if (ok) {
                        tareas.borrarTarea(id)
                        console.log('Tarea borrada')
                    }
                }
                break
        }

        guardarDB(tareas.listadoArray)

        await pausa()
    } while (opt !== '0')
}

main()
