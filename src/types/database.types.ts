export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      asistencia_diaria: {
        Row: {
          created_at: string | null
          estado_entrada: string | null
          estado_general: string | null
          estado_salida: string | null
          fecha: string
          hora_entrada_real: string | null
          hora_salida_real: string | null
          horas_trabajadas: number | null
          id: string
          id_empleado: string
          id_empresa: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado_entrada?: string | null
          estado_general?: string | null
          estado_salida?: string | null
          fecha: string
          hora_entrada_real?: string | null
          hora_salida_real?: string | null
          horas_trabajadas?: number | null
          id?: string
          id_empleado: string
          id_empresa: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado_entrada?: string | null
          estado_general?: string | null
          estado_salida?: string | null
          fecha?: string
          hora_entrada_real?: string | null
          hora_salida_real?: string | null
          horas_trabajadas?: number | null
          id?: string
          id_empleado?: string
          id_empresa?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asistencia_diaria_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencia_diaria_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencia_diaria_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencia_diaria_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencia_diaria_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      cat_area_funcional: {
        Row: {
          activo: boolean | null
          id: number
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          id?: number
          nombre: string
        }
        Update: {
          activo?: boolean | null
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      cat_categoria: {
        Row: {
          activo: boolean | null
          categoria_macro_id: number | null
          id: number
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          categoria_macro_id?: number | null
          id?: number
          nombre: string
        }
        Update: {
          activo?: boolean | null
          categoria_macro_id?: number | null
          id?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "cat_categoria_categoria_macro_id_fkey"
            columns: ["categoria_macro_id"]
            isOneToOne: false
            referencedRelation: "cat_categoria_macro"
            referencedColumns: ["id"]
          },
        ]
      }
      cat_categoria_macro: {
        Row: {
          activo: boolean | null
          id: number
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          id?: number
          nombre: string
        }
        Update: {
          activo?: boolean | null
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      cat_subcategoria: {
        Row: {
          activo: boolean | null
          categoria_id: number | null
          id: number
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          categoria_id?: number | null
          id?: number
          nombre: string
        }
        Update: {
          activo?: boolean | null
          categoria_id?: number | null
          id?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "cat_subcategoria_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "cat_categoria"
            referencedColumns: ["id"]
          },
        ]
      }
      cat_tipo_gasto_impacto: {
        Row: {
          activo: boolean | null
          id: number
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          id?: number
          nombre: string
        }
        Update: {
          activo?: boolean | null
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      catalogo_madre: {
        Row: {
          created_at: string
          id: number
          nombre_madre: string
          sku: string
        }
        Insert: {
          created_at?: string
          id?: number
          nombre_madre: string
          sku: string
        }
        Update: {
          created_at?: string
          id?: number
          nombre_madre?: string
          sku?: string
        }
        Relationships: []
      }
      categorias_madre: {
        Row: {
          bloque: string | null
          bodega: string | null
          categoria_madre: string | null
          created_at: string
          id: number
          landed_cost: number | null
          nombre_madre: string | null
          piezas_por_contenedor: number | null
          piezas_por_sku: number | null
          proveedor: string | null
          sku: string
          tiempo_preparacion: number | null
          tiempo_recompra: number | null
        }
        Insert: {
          bloque?: string | null
          bodega?: string | null
          categoria_madre?: string | null
          created_at?: string
          id?: number
          landed_cost?: number | null
          nombre_madre?: string | null
          piezas_por_contenedor?: number | null
          piezas_por_sku?: number | null
          proveedor?: string | null
          sku: string
          tiempo_preparacion?: number | null
          tiempo_recompra?: number | null
        }
        Update: {
          bloque?: string | null
          bodega?: string | null
          categoria_madre?: string | null
          created_at?: string
          id?: number
          landed_cost?: number | null
          nombre_madre?: string | null
          piezas_por_contenedor?: number | null
          piezas_por_sku?: number | null
          proveedor?: string | null
          sku?: string
          tiempo_preparacion?: number | null
          tiempo_recompra?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_madre_sku_fkey"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "catalogo_madre"
            referencedColumns: ["sku"]
          },
        ]
      }
      config_sistema: {
        Row: {
          clave: string
          valor_f: string | null
        }
        Insert: {
          clave: string
          valor_f?: string | null
        }
        Update: {
          clave?: string
          valor_f?: string | null
        }
        Relationships: []
      }
      config_ubicaciones: {
        Row: {
          creado_el: string
          creado_por: string | null
          id: number
          latitud: number | null
          longitud: number | null
          nombre_ubicacion: string | null
          radio_permitido: number | null
          tipo: string | null
        }
        Insert: {
          creado_el: string
          creado_por?: string | null
          id?: number
          latitud?: number | null
          longitud?: number | null
          nombre_ubicacion?: string | null
          radio_permitido?: number | null
          tipo?: string | null
        }
        Update: {
          creado_el?: string
          creado_por?: string | null
          id?: number
          latitud?: number | null
          longitud?: number | null
          nombre_ubicacion?: string | null
          radio_permitido?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "config_ubicaciones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_ubicaciones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_ubicaciones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_ubicaciones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_ubicaciones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      descansos: {
        Row: {
          fin_descanso: string | null
          id: number
          inicio_descanso: string | null
        }
        Insert: {
          fin_descanso?: string | null
          id?: number
          inicio_descanso?: string | null
        }
        Update: {
          fin_descanso?: string | null
          id?: number
          inicio_descanso?: string | null
        }
        Relationships: []
      }
      diccionario_skus: {
        Row: {
          bloque: string | null
          bodega: string | null
          categoria_madre: string | null
          codigo_en_siggo: string | null
          estado_en_siggo: string | null
          landed_cost: number | null
          nombre_en_siggo: string | null
          nombre_madre: string | null
          piezas_por_master: number | null
          piezas_por_sku: number | null
          piezas_totales: number | null
          presentacion_en_master_3: string | null
          presentacion_en_master_4: string | null
          presentacion_master_1: string | null
          presentacion_master_2: string | null
          rock_en_siggo: number | null
          sku: string
        }
        Insert: {
          bloque?: string | null
          bodega?: string | null
          categoria_madre?: string | null
          codigo_en_siggo?: string | null
          estado_en_siggo?: string | null
          landed_cost?: number | null
          nombre_en_siggo?: string | null
          nombre_madre?: string | null
          piezas_por_master?: number | null
          piezas_por_sku?: number | null
          piezas_totales?: number | null
          presentacion_en_master_3?: string | null
          presentacion_en_master_4?: string | null
          presentacion_master_1?: string | null
          presentacion_master_2?: string | null
          rock_en_siggo?: number | null
          sku: string
        }
        Update: {
          bloque?: string | null
          bodega?: string | null
          categoria_madre?: string | null
          codigo_en_siggo?: string | null
          estado_en_siggo?: string | null
          landed_cost?: number | null
          nombre_en_siggo?: string | null
          nombre_madre?: string | null
          piezas_por_master?: number | null
          piezas_por_sku?: number | null
          piezas_totales?: number | null
          presentacion_en_master_3?: string | null
          presentacion_en_master_4?: string | null
          presentacion_master_1?: string | null
          presentacion_master_2?: string | null
          rock_en_siggo?: number | null
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "filtrado_por_categorias_sku_fkey"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "catalogo_madre"
            referencedColumns: ["sku"]
          },
        ]
      }
      empleado_datos_biometricos: {
        Row: {
          creado_el: string | null
          descriptor_facial: Json | null
          id: number
          id_empleado: string | null
        }
        Insert: {
          creado_el?: string | null
          descriptor_facial?: Json | null
          id?: number
          id_empleado?: string | null
        }
        Update: {
          creado_el?: string | null
          descriptor_facial?: Json | null
          id?: number
          id_empleado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_avatar_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: true
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_avatar_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: true
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_avatar_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: true
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_avatar_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: true
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_avatar_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: true
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      empleado_domicilio: {
        Row: {
          c_postal: string | null
          calle: string | null
          colonia: string | null
          estado: string | null
          id: number
          id_empleado: string | null
          municipio: string | null
          n_ext: string | null
          n_int: string | null
        }
        Insert: {
          c_postal?: string | null
          calle?: string | null
          colonia?: string | null
          estado?: string | null
          id?: number
          id_empleado?: string | null
          municipio?: string | null
          n_ext?: string | null
          n_int?: string | null
        }
        Update: {
          c_postal?: string | null
          calle?: string | null
          colonia?: string | null
          estado?: string | null
          id?: number
          id_empleado?: string | null
          municipio?: string | null
          n_ext?: string | null
          n_int?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_domicilio_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_domicilio_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_domicilio_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_domicilio_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_domicilio_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      empleado_estatus: {
        Row: {
          id: number
          id_empleado: string | null
          id_estatus: number | null
        }
        Insert: {
          id?: number
          id_empleado?: string | null
          id_estatus?: number | null
        }
        Update: {
          id?: number
          id_empleado?: string | null
          id_estatus?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_estatus_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_estatus_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_estatus_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_estatus_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_estatus_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_estatus_id_estatus_fkey"
            columns: ["id_estatus"]
            isOneToOne: false
            referencedRelation: "estatus"
            referencedColumns: ["id"]
          },
        ]
      }
      empleado_horas_extra: {
        Row: {
          cantidad_horas: number | null
          "creada por": string | null
          "creada-el": string | null
          fecha_asignada: string | null
          id: number
          id_empleado: string | null
          posicion: string | null
        }
        Insert: {
          cantidad_horas?: number | null
          "creada por"?: string | null
          "creada-el"?: string | null
          fecha_asignada?: string | null
          id?: number
          id_empleado?: string | null
          posicion?: string | null
        }
        Update: {
          cantidad_horas?: number | null
          "creada por"?: string | null
          "creada-el"?: string | null
          fecha_asignada?: string | null
          id?: number
          id_empleado?: string | null
          posicion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_horas_extra_creada por_fkey"
            columns: ["creada por"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_creada por_fkey"
            columns: ["creada por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_creada por_fkey"
            columns: ["creada por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_creada por_fkey"
            columns: ["creada por"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_creada por_fkey"
            columns: ["creada por"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_horas_extra_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      empleado_puesto: {
        Row: {
          asignado_por: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id: number
          id_empleado: string | null
          id_puesto: number | null
          realizado_el: string | null
        }
        Insert: {
          asignado_por?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: number
          id_empleado?: string | null
          id_puesto?: number | null
          realizado_el?: string | null
        }
        Update: {
          asignado_por?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: number
          id_empleado?: string | null
          id_puesto?: number | null
          realizado_el?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_puesto_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_id_puesto_fkey"
            columns: ["id_puesto"]
            isOneToOne: false
            referencedRelation: "puestos"
            referencedColumns: ["id"]
          },
        ]
      }
      empleado_telefonos: {
        Row: {
          id: number
          id_empleado: string | null
          numero_telefonico: string | null
          propietario: string | null
          tipo: string | null
        }
        Insert: {
          id?: number
          id_empleado?: string | null
          numero_telefonico?: string | null
          propietario?: string | null
          tipo?: string | null
        }
        Update: {
          id?: number
          id_empleado?: string | null
          numero_telefonico?: string | null
          propietario?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuario_telefonos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_telefonos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_telefonos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_telefonos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_telefonos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      empleado_turno: {
        Row: {
          domingo: boolean | null
          id: number
          id_descanso: number | null
          id_empleado: string | null
          id_horario: number | null
          jueves: boolean | null
          lunes: boolean | null
          martes: boolean | null
          miercoles: boolean | null
          sabado: boolean | null
          viernes: boolean | null
        }
        Insert: {
          domingo?: boolean | null
          id?: number
          id_descanso?: number | null
          id_empleado?: string | null
          id_horario?: number | null
          jueves?: boolean | null
          lunes?: boolean | null
          martes?: boolean | null
          miercoles?: boolean | null
          sabado?: boolean | null
          viernes?: boolean | null
        }
        Update: {
          domingo?: boolean | null
          id?: number
          id_descanso?: number | null
          id_empleado?: string | null
          id_horario?: number | null
          jueves?: boolean | null
          lunes?: boolean | null
          martes?: boolean | null
          miercoles?: boolean | null
          sabado?: boolean | null
          viernes?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_turno_id_descanso_fkey"
            columns: ["id_descanso"]
            isOneToOne: false
            referencedRelation: "descansos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_horario_fkey"
            columns: ["id_horario"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
        ]
      }
      empleado_ubicacion_chequeo: {
        Row: {
          id: number
          id_empleado: string | null
          id_ubicaciones: number | null
        }
        Insert: {
          id?: number
          id_empleado?: string | null
          id_ubicaciones?: number | null
        }
        Update: {
          id?: number
          id_empleado?: string | null
          id_ubicaciones?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_ubicacion_chequeo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_ubicacion_chequeo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_ubicacion_chequeo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_ubicacion_chequeo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_ubicacion_chequeo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_ubicacion_chequeo_id_ubicaciones_fkey"
            columns: ["id_ubicaciones"]
            isOneToOne: false
            referencedRelation: "config_ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados: {
        Row: {
          apellido_materno: string | null
          apellido_paterno: string | null
          direccion: string | null
          fecha_ingreso: string | null
          fecha_nacimiento: string | null
          id: string
          id_empresa: number | null
          nombres: string | null
          sexo: boolean | null
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          direccion?: string | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string | null
          id?: string
          id_empresa?: number | null
          nombres?: string | null
          sexo?: boolean | null
        }
        Update: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          direccion?: string | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string | null
          id?: string
          id_empresa?: number | null
          nombres?: string | null
          sexo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "empleados_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados_estatus_baja: {
        Row: {
          capturado_por: string | null
          ejecutar_a_partir_de: string | null
          fecha: string | null
          hora: string
          id: number
          id_empleado: string | null
          incidencias_adjuntas: Json | null
          motivo: string | null
        }
        Insert: {
          capturado_por?: string | null
          ejecutar_a_partir_de?: string | null
          fecha?: string | null
          hora: string
          id?: number
          id_empleado?: string | null
          incidencias_adjuntas?: Json | null
          motivo?: string | null
        }
        Update: {
          capturado_por?: string | null
          ejecutar_a_partir_de?: string | null
          fecha?: string | null
          hora?: string
          id?: number
          id_empleado?: string | null
          incidencias_adjuntas?: Json | null
          motivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleados_bajas_permanentes_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_bajas_permanentes_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_bajas_permanentes_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_bajas_permanentes_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_bajas_permanentes_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_bajas_permanentes_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_bajas_permanentes_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_bajas_permanentes_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_bajas_permanentes_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_bajas_permanentes_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados_estatus_incapacidad: {
        Row: {
          capturado_por: string | null
          dia_fin: string | null
          dia_inicio: string | null
          fecha: string | null
          hora: string | null
          id: number
          id_empleado: string | null
        }
        Insert: {
          capturado_por?: string | null
          dia_fin?: string | null
          dia_inicio?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_empleado?: string | null
        }
        Update: {
          capturado_por?: string | null
          dia_fin?: string | null
          dia_inicio?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_empleado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleados_estatus_incapacidad_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados_estatus_vacaciones: {
        Row: {
          capturado_por: string | null
          fecha: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          hora: string | null
          id: number
          id_empleado: string | null
        }
        Insert: {
          capturado_por?: string | null
          fecha?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          hora?: string | null
          id?: number
          id_empleado?: string | null
        }
        Update: {
          capturado_por?: string | null
          fecha?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          hora?: string | null
          id?: number
          id_empleado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          id: number
          nombre_empresa: string | null
        }
        Insert: {
          id?: number
          nombre_empresa?: string | null
        }
        Update: {
          id?: number
          nombre_empresa?: string | null
        }
        Relationships: []
      }
      estatus: {
        Row: {
          descripcion: string | null
          id: number
          nombre_estatus: string
        }
        Insert: {
          descripcion?: string | null
          id?: number
          nombre_estatus: string
        }
        Update: {
          descripcion?: string | null
          id?: number
          nombre_estatus?: string
        }
        Relationships: []
      }
      etiquetas_i: {
        Row: {
          city: string | null
          client: string | null
          client_name: string | null
          code: string | null
          code_i: string | null
          cp: number | null
          created_at: string
          deli_date: string | null
          deli_hour: string | null
          folio: number | null
          hour: string | null
          id: number
          imp_date: string | null
          organization: string | null
          pack_id: number | null
          personal_inc: string | null
          product: string | null
          quantity: number | null
          sales_num: number | null
          sku: string | null
          sou_file: string | null
          state: string | null
        }
        Insert: {
          city?: string | null
          client?: string | null
          client_name?: string | null
          code?: string | null
          code_i?: string | null
          cp?: number | null
          created_at?: string
          deli_date?: string | null
          deli_hour?: string | null
          folio?: number | null
          hour?: string | null
          id?: number
          imp_date?: string | null
          organization?: string | null
          pack_id?: number | null
          personal_inc?: string | null
          product?: string | null
          quantity?: number | null
          sales_num?: number | null
          sku?: string | null
          sou_file?: string | null
          state?: string | null
        }
        Update: {
          city?: string | null
          client?: string | null
          client_name?: string | null
          code?: string | null
          code_i?: string | null
          cp?: number | null
          created_at?: string
          deli_date?: string | null
          deli_hour?: string | null
          folio?: number | null
          hour?: string | null
          id?: number
          imp_date?: string | null
          organization?: string | null
          pack_id?: number | null
          personal_inc?: string | null
          product?: string | null
          quantity?: number | null
          sales_num?: number | null
          sku?: string | null
          sou_file?: string | null
          state?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          cat: string | null
          created_at: string
          description: string | null
          id: number
          title: string | null
        }
        Insert: {
          cat?: string | null
          created_at?: string
          description?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          cat?: string | null
          created_at?: string
          description?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      funciones: {
        Row: {
          activo: string | null
          descripcion: string | null
          id: number
          id_puesto: number | null
          tipo: string | null
        }
        Insert: {
          activo?: string | null
          descripcion?: string | null
          id?: number
          id_puesto?: number | null
          tipo?: string | null
        }
        Update: {
          activo?: string | null
          descripcion?: string | null
          id?: number
          id_puesto?: number | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funciones_id_puesto_fkey"
            columns: ["id_puesto"]
            isOneToOne: false
            referencedRelation: "puestos"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos_diarios: {
        Row: {
          capturista: string | null
          categoria: number | null
          empresa: string | null
          fecha: string | null
          id: number
          monto: number | null
          tipo_gasto: string | null
        }
        Insert: {
          capturista?: string | null
          categoria?: number | null
          empresa?: string | null
          fecha?: string | null
          id?: number
          monto?: number | null
          tipo_gasto?: string | null
        }
        Update: {
          capturista?: string | null
          categoria?: number | null
          empresa?: string | null
          fecha?: string | null
          id?: number
          monto?: number | null
          tipo_gasto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gastos_diarios_categoria_fkey"
            columns: ["categoria"]
            isOneToOne: false
            referencedRelation: "cat_categoria"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios: {
        Row: {
          hora_entrada: string | null
          hora_salida: string | null
          id: number
          tipo: string | null
        }
        Insert: {
          hora_entrada?: string | null
          hora_salida?: string | null
          id?: number
          tipo?: string | null
        }
        Update: {
          hora_entrada?: string | null
          hora_salida?: string | null
          id?: number
          tipo?: string | null
        }
        Relationships: []
      }
      jerarquia: {
        Row: {
          id: number
          id_empresa: number | null
          id_padre: number | null
          id_tipo: number | null
          nombre_seccion: string | null
        }
        Insert: {
          id?: number
          id_empresa?: number | null
          id_padre?: number | null
          id_tipo?: number | null
          nombre_seccion?: string | null
        }
        Update: {
          id?: number
          id_empresa?: number | null
          id_padre?: number | null
          id_tipo?: number | null
          nombre_seccion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jerarquia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jerarquia_id_padre_fkey"
            columns: ["id_padre"]
            isOneToOne: false
            referencedRelation: "jerarquia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jerarquia_id_tipo_fkey"
            columns: ["id_tipo"]
            isOneToOne: false
            referencedRelation: "jerarquia_tipos"
            referencedColumns: ["id"]
          },
        ]
      }
      jerarquia_tipos: {
        Row: {
          descripcion: string | null
          id: number
          nombre_nivel: string | null
        }
        Insert: {
          descripcion?: string | null
          id?: number
          nombre_nivel?: string | null
        }
        Update: {
          descripcion?: string | null
          id?: number
          nombre_nivel?: string | null
        }
        Relationships: []
      }
      publicaciones: {
        Row: {
          company: string | null
          created_at: string | null
          id: number
          item_id: string
          nombre_madre: string | null
          price: number | null
          product_number: string
          sku: string
          status: string | null
          title: string | null
          variation_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          id?: number
          item_id: string
          nombre_madre?: string | null
          price?: number | null
          product_number: string
          sku: string
          status?: string | null
          title?: string | null
          variation_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          id?: number
          item_id?: string
          nombre_madre?: string | null
          price?: number | null
          product_number?: string
          sku?: string
          status?: string | null
          title?: string | null
          variation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publicaciones_sku_fkey"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "catalogo_madre"
            referencedColumns: ["sku"]
          },
        ]
      }
      publicaciones_por_sku: {
        Row: {
          created_at: string
          id: number
          publicaciones: number | null
          sku: string
        }
        Insert: {
          created_at?: string
          id?: number
          publicaciones?: number | null
          sku: string
        }
        Update: {
          created_at?: string
          id?: number
          publicaciones?: number | null
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "publicaciones_por_sku_sku_fkey"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "catalogo_madre"
            referencedColumns: ["sku"]
          },
        ]
      }
      puestos: {
        Row: {
          descripcion_general: string | null
          id: number
          id_empresa: number | null
          id_seccion_jerarquica: number | null
          nombre_puesto: string | null
        }
        Insert: {
          descripcion_general?: string | null
          id?: number
          id_empresa?: number | null
          id_seccion_jerarquica?: number | null
          nombre_puesto?: string | null
        }
        Update: {
          descripcion_general?: string | null
          id?: number
          id_empresa?: number | null
          id_seccion_jerarquica?: number | null
          nombre_puesto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "puestos_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "puestos_id_seccion_jerarquica_fkey"
            columns: ["id_seccion_jerarquica"]
            isOneToOne: false
            referencedRelation: "jerarquia"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_checador: {
        Row: {
          estatus_puntualidad: string | null
          exactitud_geografica: number | null
          fecha: string | null
          hora_esperada: string | null
          id: number
          id_empleado: string | null
          id_ubicacion: number | null
          latitud: number | null
          longitud: number | null
          registro: string | null
          tipo_registro: string | null
        }
        Insert: {
          estatus_puntualidad?: string | null
          exactitud_geografica?: number | null
          fecha?: string | null
          hora_esperada?: string | null
          id?: number
          id_empleado?: string | null
          id_ubicacion?: number | null
          latitud?: number | null
          longitud?: number | null
          registro?: string | null
          tipo_registro?: string | null
        }
        Update: {
          estatus_puntualidad?: string | null
          exactitud_geografica?: number | null
          fecha?: string | null
          hora_esperada?: string | null
          id?: number
          id_empleado?: string | null
          id_ubicacion?: number | null
          latitud?: number | null
          longitud?: number | null
          registro?: string | null
          tipo_registro?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_ubicacion_fkey"
            columns: ["id_ubicacion"]
            isOneToOne: false
            referencedRelation: "config_ubicaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_empleado_cambio_turno: {
        Row: {
          comentarios: string | null
          fecha_cambio: string | null
          id: number
          id_empleado: string
          modificado_por: string | null
          nuevo_horario: Json
        }
        Insert: {
          comentarios?: string | null
          fecha_cambio?: string | null
          id?: number
          id_empleado: string
          modificado_por?: string | null
          nuevo_horario: Json
        }
        Update: {
          comentarios?: string | null
          fecha_cambio?: string | null
          id?: number
          id_empleado?: string
          modificado_por?: string | null
          nuevo_horario?: Json
        }
        Relationships: [
          {
            foreignKeyName: "registro_empleado_cambio_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_modificado_por_fkey"
            columns: ["modificado_por"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_modificado_por_fkey"
            columns: ["modificado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_modificado_por_fkey"
            columns: ["modificado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_modificado_por_fkey"
            columns: ["modificado_por"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_cambio_turno_modificado_por_fkey"
            columns: ["modificado_por"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_inasistencias: {
        Row: {
          capturado_por: string | null
          estado_justificacion: boolean | null
          fecha: string | null
          id: number
          id_empleado: string | null
        }
        Insert: {
          capturado_por?: string | null
          estado_justificacion?: boolean | null
          fecha?: string | null
          id?: number
          id_empleado?: string | null
        }
        Update: {
          capturado_por?: string | null
          estado_justificacion?: boolean | null
          fecha?: string | null
          id?: number
          id_empleado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_checador_inasistencias_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_inasistencias_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_inasistencias_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_inasistencias_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_inasistencias_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_inasistencias_confirmadas: {
        Row: {
          capturo: string | null
          fecha: string | null
          hora: string | null
          id: number
          id_empleado: string | null
        }
        Insert: {
          capturo?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_empleado?: string | null
        }
        Update: {
          capturo?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_empleado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_inasistencias_confirmadas_capturo_fkey"
            columns: ["capturo"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_capturo_fkey"
            columns: ["capturo"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_capturo_fkey"
            columns: ["capturo"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_capturo_fkey"
            columns: ["capturo"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_capturo_fkey"
            columns: ["capturo"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      roles_sistema: {
        Row: {
          descripcion: string | null
          id: number
          nombre_rol: string | null
        }
        Insert: {
          descripcion?: string | null
          id?: number
          nombre_rol?: string | null
        }
        Update: {
          descripcion?: string | null
          id?: number
          nombre_rol?: string | null
        }
        Relationships: []
      }
      sku_alterno: {
        Row: {
          id: number | null
          sku: string
          sku_mdr: string | null
        }
        Insert: {
          id?: number | null
          sku: string
          sku_mdr?: string | null
        }
        Update: {
          id?: number | null
          sku?: string
          sku_mdr?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sku_alterno_sku_mdr_fkey"
            columns: ["sku_mdr"]
            isOneToOne: false
            referencedRelation: "sku_m"
            referencedColumns: ["sku_mdr"]
          },
        ]
      }
      sku_costos: {
        Row: {
          esti_time: number | null
          fecha_desde: string
          id: number
          landed_cost: number
          piezas_xcontenedor: number | null
          proveedor: string | null
          sku: string | null
          sku_mdr: string
        }
        Insert: {
          esti_time?: number | null
          fecha_desde?: string
          id?: number
          landed_cost: number
          piezas_xcontenedor?: number | null
          proveedor?: string | null
          sku?: string | null
          sku_mdr: string
        }
        Update: {
          esti_time?: number | null
          fecha_desde?: string
          id?: number
          landed_cost?: number
          piezas_xcontenedor?: number | null
          proveedor?: string | null
          sku?: string | null
          sku_mdr?: string
        }
        Relationships: [
          {
            foreignKeyName: "sku_costos_sku_mdr_fk"
            columns: ["sku_mdr"]
            isOneToOne: false
            referencedRelation: "sku_m"
            referencedColumns: ["sku_mdr"]
          },
        ]
      }
      sku_m: {
        Row: {
          bloque: number | null
          bodega: string | null
          cat_mdr: string | null
          empaquetado_master: string | null
          esti_time: number | null
          landed_cost: number | null
          piezas_por_sku: number | null
          piezas_xcontenedor: number | null
          pz_empaquetado_master: number | null
          sku: string | null
          sku_mdr: string
          sub_cat: string | null
        }
        Insert: {
          bloque?: number | null
          bodega?: string | null
          cat_mdr?: string | null
          empaquetado_master?: string | null
          esti_time?: number | null
          landed_cost?: number | null
          piezas_por_sku?: number | null
          piezas_xcontenedor?: number | null
          pz_empaquetado_master?: number | null
          sku?: string | null
          sku_mdr: string
          sub_cat?: string | null
        }
        Update: {
          bloque?: number | null
          bodega?: string | null
          cat_mdr?: string | null
          empaquetado_master?: string | null
          esti_time?: number | null
          landed_cost?: number | null
          piezas_por_sku?: number | null
          piezas_xcontenedor?: number | null
          pz_empaquetado_master?: number | null
          sku?: string | null
          sku_mdr?: string
          sub_cat?: string | null
        }
        Relationships: []
      }
      skus_unicos: {
        Row: {
          created_at: string
          de_recompra: number | null
          id: number
          landed_cost: number | null
          nombre_madre: string
          piezas_por_contenedor: number | null
          proveedor: string | null
          sku: string
          tiempo_de_preparacion: number | null
        }
        Insert: {
          created_at?: string
          de_recompra?: number | null
          id?: number
          landed_cost?: number | null
          nombre_madre: string
          piezas_por_contenedor?: number | null
          proveedor?: string | null
          sku: string
          tiempo_de_preparacion?: number | null
        }
        Update: {
          created_at?: string
          de_recompra?: number | null
          id?: number
          landed_cost?: number | null
          nombre_madre?: string
          piezas_por_contenedor?: number | null
          proveedor?: string | null
          sku?: string
          tiempo_de_preparacion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skus_unicos_sku_fkey"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "catalogo_madre"
            referencedColumns: ["sku"]
          },
        ]
      }
      skuxpublicaciones: {
        Row: {
          created_at: string
          id: number
          item_id: string
          nombre_madre: string | null
          sku: string
        }
        Insert: {
          created_at?: string
          id?: number
          item_id: string
          nombre_madre?: string | null
          sku: string
        }
        Update: {
          created_at?: string
          id?: number
          item_id?: string
          nombre_madre?: string | null
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "skuxpublicaciones_sku_fkey"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "catalogo_madre"
            referencedColumns: ["sku"]
          },
        ]
      }
      usuario_rol: {
        Row: {
          id: number
          id_rol: number | null
          id_usuario: string | null
        }
        Insert: {
          id?: number
          id_rol?: number | null
          id_usuario?: string | null
        }
        Update: {
          id?: number
          id_rol?: number | null
          id_usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuario_rol_id_rol_fkey"
            columns: ["id_rol"]
            isOneToOne: false
            referencedRelation: "roles_sistema"
            referencedColumns: ["id"]
          },
        ]
      }
      v_code: {
        Row: {
          code_i: string | null
          corte_etiquetas: string | null
          created_at: string
          first_code: number | null
          id: number
          personal_bar: string | null
          personal_inc: string | null
        }
        Insert: {
          code_i?: string | null
          corte_etiquetas?: string | null
          created_at?: string
          first_code?: number | null
          id?: number
          personal_bar?: string | null
          personal_inc?: string | null
        }
        Update: {
          code_i?: string | null
          corte_etiquetas?: string | null
          created_at?: string
          first_code?: number | null
          id?: number
          personal_bar?: string | null
          personal_inc?: string | null
        }
        Relationships: []
      }
      ventas: {
        Row: {
          anulaciones_reembolsos: number | null
          cargo_diferencia_peso: number | null
          cargo_venta_impuestos: number | null
          cfdi: string | null
          codigo_postal: string | null
          company: string | null
          comprador: string | null
          con_mediacion: string | null
          costo_envio: number | null
          costo_medidas_peso: number | null
          created_at: string | null
          datos_personales_empresa: string | null
          descripcion_estado: string | null
          destino: string | null
          dinero_a_favor: number | null
          direccion_fiscal: string | null
          domicilio_entrega: string | null
          es_paquete_varios: string | null
          estado: string | null
          estado_comprador: string | null
          factura_adjunta: string | null
          fecha_en_camino: string | null
          fecha_en_camino_envio: string | null
          fecha_entregado: string | null
          fecha_entregado_envio: string | null
          fecha_revision: string | null
          fecha_venta: string | null
          forma_entrega: string | null
          forma_entrega_envio: string | null
          id: number
          ife: string | null
          ingreso_envio: number | null
          ingreso_productos: number | null
          item_id: string | null
          motivo_resultado: string | null
          municipio_alcaldia: string | null
          negocio: string | null
          numero_seguimiento: string | null
          numero_seguimiento_envio: string | null
          numero_venta: string
          pais: string | null
          pertenece_kit: string | null
          price: number | null
          reclamo_abierto: string | null
          reclamo_cerrado: string | null
          regimen_fiscal: string | null
          resultado: string | null
          revisado_por_ml: boolean | null
          sku: string | null
          tipo_contribuyente: string | null
          tipo_numero_documento: string | null
          tipo_publicacion: string | null
          tipo_usuario: string | null
          title: string | null
          total: number | null
          transportista: string | null
          transportista_envio: string | null
          unidades: number | null
          unidades_envio: number | null
          unidades_reclamo: number | null
          url_seguimiento: string | null
          url_seguimiento_envio: string | null
          variante: string | null
          venta_publicidad: boolean | null
        }
        Insert: {
          anulaciones_reembolsos?: number | null
          cargo_diferencia_peso?: number | null
          cargo_venta_impuestos?: number | null
          cfdi?: string | null
          codigo_postal?: string | null
          company?: string | null
          comprador?: string | null
          con_mediacion?: string | null
          costo_envio?: number | null
          costo_medidas_peso?: number | null
          created_at?: string | null
          datos_personales_empresa?: string | null
          descripcion_estado?: string | null
          destino?: string | null
          dinero_a_favor?: number | null
          direccion_fiscal?: string | null
          domicilio_entrega?: string | null
          es_paquete_varios?: string | null
          estado?: string | null
          estado_comprador?: string | null
          factura_adjunta?: string | null
          fecha_en_camino?: string | null
          fecha_en_camino_envio?: string | null
          fecha_entregado?: string | null
          fecha_entregado_envio?: string | null
          fecha_revision?: string | null
          fecha_venta?: string | null
          forma_entrega?: string | null
          forma_entrega_envio?: string | null
          id?: number
          ife?: string | null
          ingreso_envio?: number | null
          ingreso_productos?: number | null
          item_id?: string | null
          motivo_resultado?: string | null
          municipio_alcaldia?: string | null
          negocio?: string | null
          numero_seguimiento?: string | null
          numero_seguimiento_envio?: string | null
          numero_venta: string
          pais?: string | null
          pertenece_kit?: string | null
          price?: number | null
          reclamo_abierto?: string | null
          reclamo_cerrado?: string | null
          regimen_fiscal?: string | null
          resultado?: string | null
          revisado_por_ml?: boolean | null
          sku?: string | null
          tipo_contribuyente?: string | null
          tipo_numero_documento?: string | null
          tipo_publicacion?: string | null
          tipo_usuario?: string | null
          title?: string | null
          total?: number | null
          transportista?: string | null
          transportista_envio?: string | null
          unidades?: number | null
          unidades_envio?: number | null
          unidades_reclamo?: number | null
          url_seguimiento?: string | null
          url_seguimiento_envio?: string | null
          variante?: string | null
          venta_publicidad?: boolean | null
        }
        Update: {
          anulaciones_reembolsos?: number | null
          cargo_diferencia_peso?: number | null
          cargo_venta_impuestos?: number | null
          cfdi?: string | null
          codigo_postal?: string | null
          company?: string | null
          comprador?: string | null
          con_mediacion?: string | null
          costo_envio?: number | null
          costo_medidas_peso?: number | null
          created_at?: string | null
          datos_personales_empresa?: string | null
          descripcion_estado?: string | null
          destino?: string | null
          dinero_a_favor?: number | null
          direccion_fiscal?: string | null
          domicilio_entrega?: string | null
          es_paquete_varios?: string | null
          estado?: string | null
          estado_comprador?: string | null
          factura_adjunta?: string | null
          fecha_en_camino?: string | null
          fecha_en_camino_envio?: string | null
          fecha_entregado?: string | null
          fecha_entregado_envio?: string | null
          fecha_revision?: string | null
          fecha_venta?: string | null
          forma_entrega?: string | null
          forma_entrega_envio?: string | null
          id?: number
          ife?: string | null
          ingreso_envio?: number | null
          ingreso_productos?: number | null
          item_id?: string | null
          motivo_resultado?: string | null
          municipio_alcaldia?: string | null
          negocio?: string | null
          numero_seguimiento?: string | null
          numero_seguimiento_envio?: string | null
          numero_venta?: string
          pais?: string | null
          pertenece_kit?: string | null
          price?: number | null
          reclamo_abierto?: string | null
          reclamo_cerrado?: string | null
          regimen_fiscal?: string | null
          resultado?: string | null
          revisado_por_ml?: boolean | null
          sku?: string | null
          tipo_contribuyente?: string | null
          tipo_numero_documento?: string | null
          tipo_publicacion?: string | null
          tipo_usuario?: string | null
          title?: string | null
          total?: number | null
          transportista?: string | null
          transportista_envio?: string | null
          unidades?: number | null
          unidades_envio?: number | null
          unidades_reclamo?: number | null
          url_seguimiento?: string | null
          url_seguimiento_envio?: string | null
          variante?: string | null
          venta_publicidad?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ventas_sku_fkey"
            columns: ["sku"]
            isOneToOne: false
            referencedRelation: "catalogo_madre"
            referencedColumns: ["sku"]
          },
        ]
      }
    }
    Views: {
      v_usuario_roles: {
        Row: {
          id_usuario: string | null
          nombre_rol: string | null
        }
        Relationships: []
      }
      vista_empleado_datos_editables: {
        Row: {
          direccion: string | null
          id: string | null
          telefonos: Json | null
        }
        Relationships: []
      }
      vista_empleado_ubicacion_chequeo: {
        Row: {
          id: string | null
          latitud: number | null
          longitud: number | null
          nombre_completo: string | null
          nombre_ubicacion: string | null
          radio_permitido: number | null
        }
        Relationships: []
      }
      vista_empleados_hora_entrada: {
        Row: {
          detalles_empleados: Json | null
          entrada: string | null
          id_empresa: number | null
          id_estatus: number | null
          total_personas: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_estatus_id_estatus_fkey"
            columns: ["id_estatus"]
            isOneToOne: false
            referencedRelation: "estatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      vista_horarios_empleados: {
        Row: {
          entrada: string | null
          id: string | null
          regreso_descanso: string | null
          salida: string | null
          salida_descanso: string | null
        }
        Relationships: []
      }
      vista_horarios_empleados_semanal: {
        Row: {
          entrada: string | null
          id_empleado: string | null
          jueves: boolean | null
          lunes: boolean | null
          martes: boolean | null
          miercoles: boolean | null
          regreso_descanso: string | null
          sabado: boolean | null
          salida: string | null
          salida_descanso: string | null
          viernes: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_turno_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
      vista_lista_empleados: {
        Row: {
          area: string | null
          estatus: string | null
          id: string | null
          nombre_completo: string | null
          puesto: string | null
        }
        Relationships: []
      }
      vista_registro_checador_resumida: {
        Row: {
          estatus: string | null
          fecha: string | null
          hora_esperada: string | null
          id_empleado: string | null
          nombre_ubicacion: string | null
          registro: string | null
          tipo_registro: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_datos_editables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_horarios_empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_lista_empleados"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_revoke_user_sessions: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      generar_asistencia_diaria: {
        Args: { p_fecha: string }
        Returns: undefined
      }
      obtener_historial_asistencia: {
        Args: {
          empresa_id_param?: number
          fecha_fin_param: string
          fecha_inicio_param: string
        }
        Returns: {
          dia_nombre: string
          empleado_id: string
          entrada: string
          estatus: string
          fecha: string
          motivo_ausencia: string
          nombre_completos: string
          salida: string
        }[]
      }
      verificar_identidad_biometrica: {
        Args: { descriptor_param: Json; id_empleado_param: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
