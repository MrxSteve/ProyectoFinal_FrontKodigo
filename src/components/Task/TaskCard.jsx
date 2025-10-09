import { useState } from "react"
import {
    PencilIcon,
    TrashIcon,
    EllipsisVerticalIcon,
    CalendarIcon,
    UserIcon,
    ClockIcon,
    FlagIcon,
} from "@heroicons/react/24/outline"

export const TaskCard = ({ task, onEdit, onDelete, className = "" }) => {
    const [showMenu, setShowMenu] = useState(false)

    const getPriorityColor = (prioridad) => {
        switch (prioridad?.toLowerCase()) {
            case "alta":
                return "border-red-500 bg-red-50"
            case "media":
                return "border-yellow-500 bg-yellow-50"
            case "baja":
                return "border-green-500 bg-green-50"
            default:
                return "border-gray-300 bg-gray-50"
        }
    }

    const getPriorityTextColor = (prioridad) => {
        switch (prioridad?.toLowerCase()) {
            case "alta":
                return "text-red-700"
            case "media":
                return "text-yellow-700"
            case "baja":
                return "text-green-700"
            default:
                return "text-gray-700"
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completado":
                return "bg-green-100 text-green-800"
            case "en progreso":
                return "bg-blue-100 text-blue-800"
            case "pendiente":
                return "bg-gray-100 text-gray-800"
            case "bloqueado":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const isOverdue = task.missing_days < 0
    const isDueSoon = task.missing_days >= 0 && task.missing_days <= 2

    return (
        <div
            className={`bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow ${getPriorityColor(task.prioridad)} ${className}`}
        >
            {/* Header */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{task.nombre}</h3>
                        {task.descripcion && <p className="text-sm text-gray-600 line-clamp-2 mb-2">{task.descripcion}</p>}
                    </div>

                    <div className="relative ml-2">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                            <EllipsisVerticalIcon className="h-5 w-5" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                                {onEdit && (
                                    <button
                                        onClick={() => {
                                            setShowMenu(false)
                                            onEdit(task)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        Editar tarea
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => {
                                            setShowMenu(false)
                                            onDelete(task)
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                    >
                                        <TrashIcon className="h-4 w-4 mr-2" />
                                        Eliminar tarea
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center gap-2 mb-3">
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                        {task.status || "Pendiente"}
                    </span>
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityTextColor(task.prioridad)}`}
                    >
                        <FlagIcon className="h-3 w-3 mr-1" />
                        {task.prioridad || "Media"}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span className="font-medium">{task.avance || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${task.avance === 100 ? "bg-green-500" : task.avance >= 50 ? "bg-blue-500" : "bg-yellow-500"
                                }`}
                            style={{ width: `${task.avance || 0}%` }}
                        />
                    </div>
                </div>

                {/* Task Details */}
                <div className="space-y-2 text-sm">
                    {/* Dates */}
                    <div className="flex items-center justify-between text-gray-600">
                        <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs">Asignación:</span>
                        </div>
                        <span className="text-xs font-medium">{formatDate(task.fecha_asignacion)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs">Límite:</span>
                        </div>
                        <span
                            className={`text-xs font-medium ${isOverdue ? "text-red-600" : isDueSoon ? "text-yellow-600" : "text-gray-900"
                                }`}
                        >
                            {formatDate(task.fecha_limite)}
                        </span>
                    </div>

                    {/* Time Info */}
                    {task.total_days !== undefined && (
                        <div className="flex items-center justify-between text-gray-600 text-xs">
                            <span>Días totales: {task.total_days}</span>
                            <span
                                className={`font-medium ${isOverdue ? "text-red-600" : isDueSoon ? "text-yellow-600" : "text-gray-900"
                                    }`}
                            >
                                {isOverdue ? `Vencido (${Math.abs(task.missing_days)} días)` : `Faltan ${task.missing_days} días`}
                            </span>
                        </div>
                    )}

                    {/* People */}
                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center text-gray-600">
                                <UserIcon className="h-4 w-4 mr-1" />
                                <span>Asignador:</span>
                            </div>
                            <span className="font-medium text-gray-900">{task.asignador || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs mt-1">
                            <div className="flex items-center text-gray-600">
                                <UserIcon className="h-4 w-4 mr-1" />
                                <span>Responsable:</span>
                            </div>
                            <span className="font-medium text-gray-900">{task.responsable || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
