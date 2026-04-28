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
      actas_conteo_master: {
        Row: {
          created_at: string | null
          detalles: Json
          fecha: string | null
          folio_documento: string | null
          id: string
          responsable: string
          total_productos_ajustados: number
        }
        Insert: {
          created_at?: string | null
          detalles: Json
          fecha?: string | null
          folio_documento?: string | null
          id?: string
          responsable: string
          total_productos_ajustados: number
        }
        Update: {
          created_at?: string | null
          detalles?: Json
          fecha?: string | null
          folio_documento?: string | null
          id?: string
          responsable?: string
          total_productos_ajustados?: number
        }
        Relationships: []
      }
      asistencia_diaria: {
        Row: {
          created_at: string | null
          entrada_programada: string | null
          estado_entrada: string | null
          estado_general: string | null
          estado_salida: string | null
          fecha: string
          fin_descanso_programado: string | null
          hora_entrada_real: string | null
          hora_regreso_descanso_real: string | null
          hora_salida_descanso_real: string | null
          hora_salida_real: string | null
          horas_trabajadas: number | null
          id: string
          id_empleado: string
          id_empresa: number | null
          inicio_descanso_programado: string | null
          salida_programada: string | null
          ubicacion_entrada: string | null
          ubicacion_regreso_descanso: string | null
          ubicacion_salida: string | null
          ubicacion_salida_descanso: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entrada_programada?: string | null
          estado_entrada?: string | null
          estado_general?: string | null
          estado_salida?: string | null
          fecha: string
          fin_descanso_programado?: string | null
          hora_entrada_real?: string | null
          hora_regreso_descanso_real?: string | null
          hora_salida_descanso_real?: string | null
          hora_salida_real?: string | null
          horas_trabajadas?: number | null
          id?: string
          id_empleado: string
          id_empresa?: number | null
          inicio_descanso_programado?: string | null
          salida_programada?: string | null
          ubicacion_entrada?: string | null
          ubicacion_regreso_descanso?: string | null
          ubicacion_salida?: string | null
          ubicacion_salida_descanso?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entrada_programada?: string | null
          estado_entrada?: string | null
          estado_general?: string | null
          estado_salida?: string | null
          fecha?: string
          fin_descanso_programado?: string | null
          hora_entrada_real?: string | null
          hora_regreso_descanso_real?: string | null
          hora_salida_descanso_real?: string | null
          hora_salida_real?: string | null
          horas_trabajadas?: number | null
          id?: string
          id_empleado?: string
          id_empresa?: number | null
          inicio_descanso_programado?: string | null
          salida_programada?: string | null
          ubicacion_entrada?: string | null
          ubicacion_regreso_descanso?: string | null
          ubicacion_salida?: string | null
          ubicacion_salida_descanso?: string | null
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asistencia_diaria_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
        ]
      }
      casos_reporte: {
        Row: {
          created_at: string | null
          devolucion_id: number
          fecha_apertura: string | null
          fecha_verificacion: string | null
          id: number
          numero_caso_ml: string | null
          saldo: number | null
          tiempo_respuesta: string | null
          veredicto: string | null
        }
        Insert: {
          created_at?: string | null
          devolucion_id: number
          fecha_apertura?: string | null
          fecha_verificacion?: string | null
          id?: number
          numero_caso_ml?: string | null
          saldo?: number | null
          tiempo_respuesta?: string | null
          veredicto?: string | null
        }
        Update: {
          created_at?: string | null
          devolucion_id?: number
          fecha_apertura?: string | null
          fecha_verificacion?: string | null
          id?: number
          numero_caso_ml?: string | null
          saldo?: number | null
          tiempo_respuesta?: string | null
          veredicto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "casos_reporte_devolucion_id_fkey"
            columns: ["devolucion_id"]
            isOneToOne: false
            referencedRelation: "devoluciones"
            referencedColumns: ["id"]
          },
        ]
      }
      cat_banco: {
        Row: {
          activo: boolean | null
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          nombre: string
        }
        Update: {
          activo?: boolean | null
          nombre?: string
        }
        Relationships: []
      }
      cat_cuenta: {
        Row: {
          activo: boolean | null
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          nombre: string
        }
        Update: {
          activo?: boolean | null
          nombre?: string
        }
        Relationships: []
      }
      cat_diccionario_maestro: {
        Row: {
          activo: boolean | null
          area_funcional: string | null
          canal: string | null
          categoria: string | null
          categoria_macro: string | null
          centro_de_costo: string | null
          clasificacion_operativa: string | null
          created_at: string | null
          impacto: string | null
          nombre: string
          subcategoria: string | null
        }
        Insert: {
          activo?: boolean | null
          area_funcional?: string | null
          canal?: string | null
          categoria?: string | null
          categoria_macro?: string | null
          centro_de_costo?: string | null
          clasificacion_operativa?: string | null
          created_at?: string | null
          impacto?: string | null
          nombre: string
          subcategoria?: string | null
        }
        Update: {
          activo?: boolean | null
          area_funcional?: string | null
          canal?: string | null
          categoria?: string | null
          categoria_macro?: string | null
          centro_de_costo?: string | null
          clasificacion_operativa?: string | null
          created_at?: string | null
          impacto?: string | null
          nombre?: string
          subcategoria?: string | null
        }
        Relationships: []
      }
      cat_empresa: {
        Row: {
          activo: boolean | null
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          nombre: string
        }
        Update: {
          activo?: boolean | null
          nombre?: string
        }
        Relationships: []
      }
      cat_gastos_recurrentes: {
        Row: {
          area_funcional: string | null
          banco: string | null
          canal: string | null
          categoria: string | null
          categoria_macro: string | null
          clasificacion_operativa: string | null
          clasificador_maestro: string | null
          creador: string | null
          cuenta: string | null
          descripcion: string | null
          dia_ejecucion: number
          empresa: string | null
          estado: string | null
          fecha_creacion: string | null
          fecha_edicion: string | null
          fecha_fin: string | null
          fecha_inicio: string
          fecha_pausado: string | null
          frecuencia: string
          id_gasto_r: number
          impacto: string | null
          metodo_aprobacion: string
          metodo_pago: string | null
          monto_base: number
          nombre: string
          notas: string | null
          subcategoria: string | null
          tipo: string | null
          ultima_ejecucion: string | null
        }
        Insert: {
          area_funcional?: string | null
          banco?: string | null
          canal?: string | null
          categoria?: string | null
          categoria_macro?: string | null
          clasificacion_operativa?: string | null
          clasificador_maestro?: string | null
          creador?: string | null
          cuenta?: string | null
          descripcion?: string | null
          dia_ejecucion: number
          empresa?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_edicion?: string | null
          fecha_fin?: string | null
          fecha_inicio: string
          fecha_pausado?: string | null
          frecuencia: string
          id_gasto_r?: number
          impacto?: string | null
          metodo_aprobacion: string
          metodo_pago?: string | null
          monto_base: number
          nombre: string
          notas?: string | null
          subcategoria?: string | null
          tipo?: string | null
          ultima_ejecucion?: string | null
        }
        Update: {
          area_funcional?: string | null
          banco?: string | null
          canal?: string | null
          categoria?: string | null
          categoria_macro?: string | null
          clasificacion_operativa?: string | null
          clasificador_maestro?: string | null
          creador?: string | null
          cuenta?: string | null
          descripcion?: string | null
          dia_ejecucion?: number
          empresa?: string | null
          estado?: string | null
          fecha_creacion?: string | null
          fecha_edicion?: string | null
          fecha_fin?: string | null
          fecha_inicio?: string
          fecha_pausado?: string | null
          frecuencia?: string
          id_gasto_r?: number
          impacto?: string | null
          metodo_aprobacion?: string
          metodo_pago?: string | null
          monto_base?: number
          nombre?: string
          notas?: string | null
          subcategoria?: string | null
          tipo?: string | null
          ultima_ejecucion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cat_gastos_recurrentes_clasificador_maestro_fkey"
            columns: ["clasificador_maestro"]
            isOneToOne: false
            referencedRelation: "cat_diccionario_maestro"
            referencedColumns: ["nombre"]
          },
        ]
      }
      cat_pago: {
        Row: {
          activo: boolean | null
          nombre: string
        }
        Insert: {
          activo?: boolean | null
          nombre: string
        }
        Update: {
          activo?: boolean | null
          nombre?: string
        }
        Relationships: []
      }
      cat_palabras_clave: {
        Row: {
          activo: boolean | null
          clasificador_maestro: string | null
          created_at: string | null
          palabra: string
        }
        Insert: {
          activo?: boolean | null
          clasificador_maestro?: string | null
          created_at?: string | null
          palabra: string
        }
        Update: {
          activo?: boolean | null
          clasificador_maestro?: string | null
          created_at?: string | null
          palabra?: string
        }
        Relationships: [
          {
            foreignKeyName: "cat_palabras_clave_clasificador_maestro_fkey"
            columns: ["clasificador_maestro"]
            isOneToOne: false
            referencedRelation: "cat_diccionario_maestro"
            referencedColumns: ["nombre"]
          },
        ]
      }
      cat_servicios_bas: {
        Row: {
          created_at: string
          nombre_representante: string | null
          nombre_servicio: string
          num_servicio: number | null
          ubicacion: string | null
        }
        Insert: {
          created_at?: string
          nombre_representante?: string | null
          nombre_servicio: string
          num_servicio?: number | null
          ubicacion?: string | null
        }
        Update: {
          created_at?: string
          nombre_representante?: string | null
          nombre_servicio?: string
          num_servicio?: number | null
          ubicacion?: string | null
        }
        Relationships: []
      }
      cat_tipo_movimiento: {
        Row: {
          created_at: string
          nombre: string
        }
        Insert: {
          created_at?: string
          nombre: string
        }
        Update: {
          created_at?: string
          nombre?: string
        }
        Relationships: []
      }
      config_sistema: {
        Row: {
          clave: string
          valor_ds: string | null
          valor_f: string | null
          valor_h: string | null
        }
        Insert: {
          clave: string
          valor_ds?: string | null
          valor_f?: string | null
          valor_h?: string | null
        }
        Update: {
          clave?: string
          valor_ds?: string | null
          valor_f?: string | null
          valor_h?: string | null
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "config_ubicaciones_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
        ]
      }
      dashboard_presupuesto: {
        Row: {
          disponible: number
          ejecutado: number
          estado_registro: string
          id: string
          nombre: string
          presupuesto: number
          progreso: number
          ultima_actualizacion: string | null
        }
        Insert: {
          disponible?: number
          ejecutado?: number
          estado_registro: string
          id: string
          nombre: string
          presupuesto?: number
          progreso?: number
          ultima_actualizacion?: string | null
        }
        Update: {
          disponible?: number
          ejecutado?: number
          estado_registro?: string
          id?: string
          nombre?: string
          presupuesto?: number
          progreso?: number
          ultima_actualizacion?: string | null
        }
        Relationships: []
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
      devoluciones: {
        Row: {
          created_at: string
          error_prop: boolean | null
          estado_llegada: Database["public"]["Enums"]["estado_llegada_enum"]
          factura: boolean | null
          fecha_llegada: string | null
          fecha_venta: string | null
          id: number
          motivo_devo: string | null
          nombre_despacho: string | null
          nombre_revision: string | null
          num_venta: number | null
          observacion: string | null
          producto: string | null
          reporte: boolean | null
          s_revision: string | null
          sku: string | null
          tienda: string | null
        }
        Insert: {
          created_at?: string
          error_prop?: boolean | null
          estado_llegada: Database["public"]["Enums"]["estado_llegada_enum"]
          factura?: boolean | null
          fecha_llegada?: string | null
          fecha_venta?: string | null
          id?: number
          motivo_devo?: string | null
          nombre_despacho?: string | null
          nombre_revision?: string | null
          num_venta?: number | null
          observacion?: string | null
          producto?: string | null
          reporte?: boolean | null
          s_revision?: string | null
          sku?: string | null
          tienda?: string | null
        }
        Update: {
          created_at?: string
          error_prop?: boolean | null
          estado_llegada?: Database["public"]["Enums"]["estado_llegada_enum"]
          factura?: boolean | null
          fecha_llegada?: string | null
          fecha_venta?: string | null
          id?: number
          motivo_devo?: string | null
          nombre_despacho?: string | null
          nombre_revision?: string | null
          num_venta?: number | null
          observacion?: string | null
          producto?: string | null
          reporte?: boolean | null
          s_revision?: string | null
          sku?: string | null
          tienda?: string | null
        }
        Relationships: []
      }
      devoluciones_ml: {
        Row: {
          anu_reembolsos: number | null
          cargo_difpeso: number | null
          cargo_venta: number | null
          con_mediacion: boolean | null
          costo_envio: number | null
          costo_envio_medxpeso: number | null
          created_at: string
          date_entregado: string | null
          desc_status: string | null
          destino: string | null
          dinero_afavor: string | null
          driver_name: string | null
          driver_plate: string | null
          entregado: boolean | null
          fecha_camino: string | null
          fecha_entregado: string | null
          fecha_revision: string | null
          fecha_status: string | null
          fecha_venta: string | null
          form_entrega: string | null
          id: number
          ing_xenvio: number | null
          ing_xunidad: number | null
          kit: boolean | null
          motivo_resultado: string | null
          name_inc: string | null
          num_publi: string | null
          num_seguimiento: string | null
          num_venta: string | null
          precio_uni_venta: number | null
          reclamo_abierto: boolean | null
          reclamo_cerrado: number | null
          resultado: string | null
          revisado_ml: boolean | null
          sku: string | null
          status: string | null
          tienda: string | null
          tip_publi: string | null
          titulo_publi: string | null
          total: number | null
          transportista: string | null
          unidades: number | null
          url_seguimiento: string | null
          variante: string | null
          varios_productos: boolean | null
          venta_xpublicidad: boolean | null
        }
        Insert: {
          anu_reembolsos?: number | null
          cargo_difpeso?: number | null
          cargo_venta?: number | null
          con_mediacion?: boolean | null
          costo_envio?: number | null
          costo_envio_medxpeso?: number | null
          created_at?: string
          date_entregado?: string | null
          desc_status?: string | null
          destino?: string | null
          dinero_afavor?: string | null
          driver_name?: string | null
          driver_plate?: string | null
          entregado?: boolean | null
          fecha_camino?: string | null
          fecha_entregado?: string | null
          fecha_revision?: string | null
          fecha_status?: string | null
          fecha_venta?: string | null
          form_entrega?: string | null
          id?: number
          ing_xenvio?: number | null
          ing_xunidad?: number | null
          kit?: boolean | null
          motivo_resultado?: string | null
          name_inc?: string | null
          num_publi?: string | null
          num_seguimiento?: string | null
          num_venta?: string | null
          precio_uni_venta?: number | null
          reclamo_abierto?: boolean | null
          reclamo_cerrado?: number | null
          resultado?: string | null
          revisado_ml?: boolean | null
          sku?: string | null
          status?: string | null
          tienda?: string | null
          tip_publi?: string | null
          titulo_publi?: string | null
          total?: number | null
          transportista?: string | null
          unidades?: number | null
          url_seguimiento?: string | null
          variante?: string | null
          varios_productos?: boolean | null
          venta_xpublicidad?: boolean | null
        }
        Update: {
          anu_reembolsos?: number | null
          cargo_difpeso?: number | null
          cargo_venta?: number | null
          con_mediacion?: boolean | null
          costo_envio?: number | null
          costo_envio_medxpeso?: number | null
          created_at?: string
          date_entregado?: string | null
          desc_status?: string | null
          destino?: string | null
          dinero_afavor?: string | null
          driver_name?: string | null
          driver_plate?: string | null
          entregado?: boolean | null
          fecha_camino?: string | null
          fecha_entregado?: string | null
          fecha_revision?: string | null
          fecha_status?: string | null
          fecha_venta?: string | null
          form_entrega?: string | null
          id?: number
          ing_xenvio?: number | null
          ing_xunidad?: number | null
          kit?: boolean | null
          motivo_resultado?: string | null
          name_inc?: string | null
          num_publi?: string | null
          num_seguimiento?: string | null
          num_venta?: string | null
          precio_uni_venta?: number | null
          reclamo_abierto?: boolean | null
          reclamo_cerrado?: number | null
          resultado?: string | null
          revisado_ml?: boolean | null
          sku?: string | null
          status?: string | null
          tienda?: string | null
          tip_publi?: string | null
          titulo_publi?: string | null
          total?: number | null
          transportista?: string | null
          unidades?: number | null
          url_seguimiento?: string | null
          variante?: string | null
          varios_productos?: boolean | null
          venta_xpublicidad?: boolean | null
        }
        Relationships: []
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_avatar_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: true
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_domicilio_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_estatus_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
          {
            foreignKeyName: "empleado_estatus_id_estatus_fkey"
            columns: ["id_estatus"]
            isOneToOne: false
            referencedRelation: "estatus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_estatus_id_estatus_fkey"
            columns: ["id_estatus"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_estatus"]
          },
        ]
      }
      empleado_puesto: {
        Row: {
          asignado_por: string | null
          creado_el: string | null
          id: number
          id_empleado: string | null
          id_puesto: number | null
          orden: number | null
        }
        Insert: {
          asignado_por?: string | null
          creado_el?: string | null
          id?: number
          id_empleado?: string | null
          id_puesto?: number | null
          orden?: number | null
        }
        Update: {
          asignado_por?: string | null
          creado_el?: string | null
          id?: number
          id_empleado?: string | null
          id_puesto?: number | null
          orden?: number | null
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_puesto_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
      empleado_sueldo: {
        Row: {
          cantidad: number | null
          id: number
          id_empleado: string | null
        }
        Insert: {
          cantidad?: number | null
          id?: number
          id_empleado?: string | null
        }
        Update: {
          cantidad?: number | null
          id?: number
          id_empleado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_sueldo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_sueldo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_sueldo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_telefonos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_ubicacion_chequeo_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
          email: string | null
          fecha_ingreso: string | null
          fecha_nacimiento: string | null
          id: string
          nombres: string | null
          sexo: boolean | null
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          email?: string | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombres?: string | null
          sexo?: boolean | null
        }
        Update: {
          apellido_materno?: string | null
          apellido_paterno?: string | null
          email?: string | null
          fecha_ingreso?: string | null
          fecha_nacimiento?: string | null
          id?: string
          nombres?: string | null
          sexo?: boolean | null
        }
        Relationships: []
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_bajas_permanentes_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_bajas_permanentes_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
        ]
      }
      empleados_estatus_incapacidad: {
        Row: {
          capturado_por: string | null
          dia_fin: string | null
          dia_inicio: string | null
          fecha: string | null
          folio_imss: string | null
          hora: string | null
          id: number
          id_empleado: string | null
        }
        Insert: {
          capturado_por?: string | null
          dia_fin?: string | null
          dia_inicio?: string | null
          fecha?: string | null
          folio_imss?: string | null
          hora?: string | null
          id?: number
          id_empleado?: string | null
        }
        Update: {
          capturado_por?: string | null
          dia_fin?: string | null
          dia_inicio?: string | null
          fecha?: string | null
          folio_imss?: string | null
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_estatus_incapacidad_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_capturado_por_fkey"
            columns: ["capturado_por"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_empleado_estado_vacaciones_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
        ]
      }
      empleados_turno_descansos: {
        Row: {
          domingo: number | null
          ejecutar_a_partir_de: string | null
          fecha: string | null
          hora: string | null
          id: number
          id_capturista: string | null
          id_empleado: string | null
          jueves: number | null
          lunes: number | null
          martes: number | null
          miercoles: number | null
          sabado: number | null
          viernes: number | null
        }
        Insert: {
          domingo?: number | null
          ejecutar_a_partir_de?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_capturista?: string | null
          id_empleado?: string | null
          jueves?: number | null
          lunes?: number | null
          martes?: number | null
          miercoles?: number | null
          sabado?: number | null
          viernes?: number | null
        }
        Update: {
          domingo?: number | null
          ejecutar_a_partir_de?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_capturista?: string | null
          id_empleado?: string | null
          jueves?: number | null
          lunes?: number | null
          martes?: number | null
          miercoles?: number | null
          sabado?: number | null
          viernes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empleados_turno_descansos_domingo_fkey"
            columns: ["domingo"]
            isOneToOne: false
            referencedRelation: "descansos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_jueves_fkey"
            columns: ["jueves"]
            isOneToOne: false
            referencedRelation: "descansos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_lunes_fkey"
            columns: ["lunes"]
            isOneToOne: false
            referencedRelation: "descansos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_martes_fkey"
            columns: ["martes"]
            isOneToOne: false
            referencedRelation: "descansos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_miercoles_fkey"
            columns: ["miercoles"]
            isOneToOne: false
            referencedRelation: "descansos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_sabado_fkey"
            columns: ["sabado"]
            isOneToOne: false
            referencedRelation: "descansos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_descansos_viernes_fkey"
            columns: ["viernes"]
            isOneToOne: false
            referencedRelation: "descansos"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados_turno_horarios: {
        Row: {
          domingo: number | null
          ejecutar_a_partir_de: string | null
          fecha: string | null
          hora: string | null
          id: number
          id_capturista: string | null
          id_empleado: string | null
          jueves: number | null
          lunes: number | null
          martes: number | null
          miercoles: number | null
          sabado: number | null
          viernes: number | null
        }
        Insert: {
          domingo?: number | null
          ejecutar_a_partir_de?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_capturista?: string | null
          id_empleado?: string | null
          jueves?: number | null
          lunes?: number | null
          martes?: number | null
          miercoles?: number | null
          sabado?: number | null
          viernes?: number | null
        }
        Update: {
          domingo?: number | null
          ejecutar_a_partir_de?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_capturista?: string | null
          id_empleado?: string | null
          jueves?: number | null
          lunes?: number | null
          martes?: number | null
          miercoles?: number | null
          sabado?: number | null
          viernes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empleados_turno_horarios_domingo_fkey"
            columns: ["domingo"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_jueves_fkey"
            columns: ["jueves"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_lunes_fkey"
            columns: ["lunes"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_martes_fkey"
            columns: ["martes"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_miercoles_fkey"
            columns: ["miercoles"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_sabado_fkey"
            columns: ["sabado"]
            isOneToOne: false
            referencedRelation: "horarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_turno_horarios_viernes_fkey"
            columns: ["viernes"]
            isOneToOne: false
            referencedRelation: "horarios"
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
      empresas_master: {
        Row: {
          created_at: string
          id: number
          nombre_empresa: string | null
          rfc: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nombre_empresa?: string | null
          rfc?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nombre_empresa?: string | null
          rfc?: string | null
        }
        Relationships: []
      }
      estatus: {
        Row: {
          descripcion: string | null
          id: number
          nombre_estatus: string | null
        }
        Insert: {
          descripcion?: string | null
          id?: number
          nombre_estatus?: string | null
        }
        Update: {
          descripcion?: string | null
          id?: number
          nombre_estatus?: string | null
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
      facturas: {
        Row: {
          factura: string | null
          id: number
          num_venta: number | null
        }
        Insert: {
          factura?: string | null
          id?: number
          num_venta?: number | null
        }
        Update: {
          factura?: string | null
          id?: number
          num_venta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "facturas_num_venta_fkey"
            columns: ["num_venta"]
            isOneToOne: false
            referencedRelation: "devoluciones"
            referencedColumns: ["num_venta"]
          },
        ]
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
      inventory_master: {
        Row: {
          alto: number | null
          ancho: number | null
          bloque: string | null
          bodega: string | null
          cajas: number | null
          categoria: string | null
          clasificacion_sat: string | null
          clave_sat: number | null
          code_siggo: string | null
          codebar: number | null
          created_at: string | null
          documento_folio: string | null
          empaquetado_master: string | null
          empresa_pertenece: string | null
          estado_producto: string | null
          factura: string | null
          id: number
          id_proveedor: number | null
          images: string | null
          img_acomodo: string | null
          img_recepcion: string | null
          img_ubicacion: string | null
          landed_cost: number | null
          landed_cost_subcategoria: number | null
          largo: number | null
          location_id: number | null
          location_master: string | null
          maximo: number | null
          medidas: string | null
          minimo: number | null
          nave: string | null
          nombre_madre: string | null
          nombre_siggo: string | null
          piezas_por_sku: number | null
          precio_publico_l1: number | null
          pz_caja: number | null
          pz_master: number | null
          pz_por_contenedor: number | null
          responsable: string | null
          sku_alias: string | null
          sku_oficial: string | null
          stock_inicial: number | null
          subcategoria: string | null
          tipo_de_empaquetado: string | null
          torre: string | null
          unidad_empaquetado: string | null
          unidad_medida_sat: string | null
          updated_at: string | null
        }
        Insert: {
          alto?: number | null
          ancho?: number | null
          bloque?: string | null
          bodega?: string | null
          cajas?: number | null
          categoria?: string | null
          clasificacion_sat?: string | null
          clave_sat?: number | null
          code_siggo?: string | null
          codebar?: number | null
          created_at?: string | null
          documento_folio?: string | null
          empaquetado_master?: string | null
          empresa_pertenece?: string | null
          estado_producto?: string | null
          factura?: string | null
          id?: number
          id_proveedor?: number | null
          images?: string | null
          img_acomodo?: string | null
          img_recepcion?: string | null
          img_ubicacion?: string | null
          landed_cost?: number | null
          landed_cost_subcategoria?: number | null
          largo?: number | null
          location_id?: number | null
          location_master?: string | null
          maximo?: number | null
          medidas?: string | null
          minimo?: number | null
          nave?: string | null
          nombre_madre?: string | null
          nombre_siggo?: string | null
          piezas_por_sku?: number | null
          precio_publico_l1?: number | null
          pz_caja?: number | null
          pz_master?: number | null
          pz_por_contenedor?: number | null
          responsable?: string | null
          sku_alias?: string | null
          sku_oficial?: string | null
          stock_inicial?: number | null
          subcategoria?: string | null
          tipo_de_empaquetado?: string | null
          torre?: string | null
          unidad_empaquetado?: string | null
          unidad_medida_sat?: string | null
          updated_at?: string | null
        }
        Update: {
          alto?: number | null
          ancho?: number | null
          bloque?: string | null
          bodega?: string | null
          cajas?: number | null
          categoria?: string | null
          clasificacion_sat?: string | null
          clave_sat?: number | null
          code_siggo?: string | null
          codebar?: number | null
          created_at?: string | null
          documento_folio?: string | null
          empaquetado_master?: string | null
          empresa_pertenece?: string | null
          estado_producto?: string | null
          factura?: string | null
          id?: number
          id_proveedor?: number | null
          images?: string | null
          img_acomodo?: string | null
          img_recepcion?: string | null
          img_ubicacion?: string | null
          landed_cost?: number | null
          landed_cost_subcategoria?: number | null
          largo?: number | null
          location_id?: number | null
          location_master?: string | null
          maximo?: number | null
          medidas?: string | null
          minimo?: number | null
          nave?: string | null
          nombre_madre?: string | null
          nombre_siggo?: string | null
          piezas_por_sku?: number | null
          precio_publico_l1?: number | null
          pz_caja?: number | null
          pz_master?: number | null
          pz_por_contenedor?: number | null
          responsable?: string | null
          sku_alias?: string | null
          sku_oficial?: string | null
          stock_inicial?: number | null
          subcategoria?: string | null
          tipo_de_empaquetado?: string | null
          torre?: string | null
          unidad_empaquetado?: string | null
          unidad_medida_sat?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_proveedor_inmatmex"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "table_proveedores"
            referencedColumns: ["id_proveedor"]
          },
          {
            foreignKeyName: "inventory_master_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location_master"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          accion: string | null
          ajuste: number | null
          cant_empaques: number | null
          categoria: string | null
          documento_folio: string | null
          empaquetado_master: string
          empresa: string | null
          factura: string | null
          fech_mov: string | null
          final_stock: number | null
          id: number
          location_id: number | null
          motivo_edicion: string | null
          nombre_madre: string | null
          nombre_personal: string | null
          nombre_picker: string | null
          origen_conteo_fisico: string | null
          product_id: number | null
          pz_por_empaque: number | null
          stock_inicial: number | null
          subcategoria: string | null
          ubicacion: string | null
        }
        Insert: {
          accion?: string | null
          ajuste?: number | null
          cant_empaques?: number | null
          categoria?: string | null
          documento_folio?: string | null
          empaquetado_master: string
          empresa?: string | null
          factura?: string | null
          fech_mov?: string | null
          final_stock?: number | null
          id?: number
          location_id?: number | null
          motivo_edicion?: string | null
          nombre_madre?: string | null
          nombre_personal?: string | null
          nombre_picker?: string | null
          origen_conteo_fisico?: string | null
          product_id?: number | null
          pz_por_empaque?: number | null
          stock_inicial?: number | null
          subcategoria?: string | null
          ubicacion?: string | null
        }
        Update: {
          accion?: string | null
          ajuste?: number | null
          cant_empaques?: number | null
          categoria?: string | null
          documento_folio?: string | null
          empaquetado_master?: string
          empresa?: string | null
          factura?: string | null
          fech_mov?: string | null
          final_stock?: number | null
          id?: number
          location_id?: number | null
          motivo_edicion?: string | null
          nombre_madre?: string | null
          nombre_personal?: string | null
          nombre_picker?: string | null
          origen_conteo_fisico?: string | null
          product_id?: number | null
          pz_por_empaque?: number | null
          stock_inicial?: number | null
          subcategoria?: string | null
          ubicacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "location_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_master"
            referencedColumns: ["id"]
          },
        ]
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
            foreignKeyName: "jerarquia_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empresa"]
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
      kardex_cotiza_master: {
        Row: {
          abono: number | null
          accion: string | null
          accion_realizada: string | null
          cliente_nombre: string | null
          detalle_productos: Json | null
          fecha: string | null
          folio: string
          forma_pago: string | null
          id: number
          responsable_cobro: string | null
          saldo_pendiente: number | null
          total: number | null
          total_cotizado: number | null
          vendedor_nombre: string
          venta_id: string | null
        }
        Insert: {
          abono?: number | null
          accion?: string | null
          accion_realizada?: string | null
          cliente_nombre?: string | null
          detalle_productos?: Json | null
          fecha?: string | null
          folio: string
          forma_pago?: string | null
          id?: number
          responsable_cobro?: string | null
          saldo_pendiente?: number | null
          total?: number | null
          total_cotizado?: number | null
          vendedor_nombre: string
          venta_id?: string | null
        }
        Update: {
          abono?: number | null
          accion?: string | null
          accion_realizada?: string | null
          cliente_nombre?: string | null
          detalle_productos?: Json | null
          fecha?: string | null
          folio?: string
          forma_pago?: string | null
          id?: number
          responsable_cobro?: string | null
          saldo_pendiente?: number | null
          total?: number | null
          total_cotizado?: number | null
          vendedor_nombre?: string
          venta_id?: string | null
        }
        Relationships: []
      }
      location_master: {
        Row: {
          bloque: string | null
          bodega: string | null
          empresa_id: number | null
          id: number
          nave: string | null
          torre: string | null
        }
        Insert: {
          bloque?: string | null
          bodega?: string | null
          empresa_id?: number | null
          id?: number
          nave?: string | null
          torre?: string | null
        }
        Update: {
          bloque?: string | null
          bodega?: string | null
          empresa_id?: number | null
          id?: number
          nave?: string | null
          torre?: string | null
        }
        Relationships: []
      }
      ml_sales: {
        Row: {
          anu_reembolsos: number | null
          c_mediacion: boolean | null
          c_postal: string | null
          cargo_difpeso: number | null
          cargo_venta: number | null
          cfdi: string | null
          check: boolean | null
          comprador: string | null
          costo_envio: number | null
          costo_enviomp: number | null
          created_at: string
          d_afavor: string | null
          datos_poe: string | null
          desc_status: string | null
          destino: string | null
          direccion: string | null
          domicilio: string | null
          estado: string | null
          f_camino: string | null
          f_camino2: string | null
          f_entrega: string | null
          f_entrega2: string | null
          f_entregado: string | null
          f_entregado2: string | null
          f_revision3: string | null
          factura_a: string | null
          fecha_venta: string | null
          id: number
          ife: string | null
          ing_xenvio: number | null
          ing_xunidad: number | null
          markup: number | null
          motivo_resul: string | null
          mun_alcaldia: string | null
          negocio: boolean | null
          num_publi: string | null
          num_seguimiento: string | null
          num_seguimiento2: string | null
          num_venta: string | null
          pais: string | null
          paquete_varios: boolean | null
          pertenece_kit: boolean | null
          price: number | null
          profit: number | null
          r_abierto: boolean | null
          r_cerrado: boolean | null
          r_fiscal: string | null
          resultado: string | null
          revisado_xml: string | null
          sku: string | null
          status: string | null
          t_contribuyente: string | null
          t_usuario: string | null
          tienda: string | null
          tip_publi: string | null
          tipo_ndoc: string | null
          tit_pub: string | null
          total: number | null
          total_final: number | null
          transportista: string | null
          transportista2: string | null
          unidades: number | null
          unidades_2: number | null
          unidades_3: number | null
          url_seguimiento: string | null
          url_seguimiento2: string | null
          variante: string | null
          venta_xpublicidad: boolean | null
        }
        Insert: {
          anu_reembolsos?: number | null
          c_mediacion?: boolean | null
          c_postal?: string | null
          cargo_difpeso?: number | null
          cargo_venta?: number | null
          cfdi?: string | null
          check?: boolean | null
          comprador?: string | null
          costo_envio?: number | null
          costo_enviomp?: number | null
          created_at?: string
          d_afavor?: string | null
          datos_poe?: string | null
          desc_status?: string | null
          destino?: string | null
          direccion?: string | null
          domicilio?: string | null
          estado?: string | null
          f_camino?: string | null
          f_camino2?: string | null
          f_entrega?: string | null
          f_entrega2?: string | null
          f_entregado?: string | null
          f_entregado2?: string | null
          f_revision3?: string | null
          factura_a?: string | null
          fecha_venta?: string | null
          id?: number
          ife?: string | null
          ing_xenvio?: number | null
          ing_xunidad?: number | null
          markup?: number | null
          motivo_resul?: string | null
          mun_alcaldia?: string | null
          negocio?: boolean | null
          num_publi?: string | null
          num_seguimiento?: string | null
          num_seguimiento2?: string | null
          num_venta?: string | null
          pais?: string | null
          paquete_varios?: boolean | null
          pertenece_kit?: boolean | null
          price?: number | null
          profit?: number | null
          r_abierto?: boolean | null
          r_cerrado?: boolean | null
          r_fiscal?: string | null
          resultado?: string | null
          revisado_xml?: string | null
          sku?: string | null
          status?: string | null
          t_contribuyente?: string | null
          t_usuario?: string | null
          tienda?: string | null
          tip_publi?: string | null
          tipo_ndoc?: string | null
          tit_pub?: string | null
          total?: number | null
          total_final?: number | null
          transportista?: string | null
          transportista2?: string | null
          unidades?: number | null
          unidades_2?: number | null
          unidades_3?: number | null
          url_seguimiento?: string | null
          url_seguimiento2?: string | null
          variante?: string | null
          venta_xpublicidad?: boolean | null
        }
        Update: {
          anu_reembolsos?: number | null
          c_mediacion?: boolean | null
          c_postal?: string | null
          cargo_difpeso?: number | null
          cargo_venta?: number | null
          cfdi?: string | null
          check?: boolean | null
          comprador?: string | null
          costo_envio?: number | null
          costo_enviomp?: number | null
          created_at?: string
          d_afavor?: string | null
          datos_poe?: string | null
          desc_status?: string | null
          destino?: string | null
          direccion?: string | null
          domicilio?: string | null
          estado?: string | null
          f_camino?: string | null
          f_camino2?: string | null
          f_entrega?: string | null
          f_entrega2?: string | null
          f_entregado?: string | null
          f_entregado2?: string | null
          f_revision3?: string | null
          factura_a?: string | null
          fecha_venta?: string | null
          id?: number
          ife?: string | null
          ing_xenvio?: number | null
          ing_xunidad?: number | null
          markup?: number | null
          motivo_resul?: string | null
          mun_alcaldia?: string | null
          negocio?: boolean | null
          num_publi?: string | null
          num_seguimiento?: string | null
          num_seguimiento2?: string | null
          num_venta?: string | null
          pais?: string | null
          paquete_varios?: boolean | null
          pertenece_kit?: boolean | null
          price?: number | null
          profit?: number | null
          r_abierto?: boolean | null
          r_cerrado?: boolean | null
          r_fiscal?: string | null
          resultado?: string | null
          revisado_xml?: string | null
          sku?: string | null
          status?: string | null
          t_contribuyente?: string | null
          t_usuario?: string | null
          tienda?: string | null
          tip_publi?: string | null
          tipo_ndoc?: string | null
          tit_pub?: string | null
          total?: number | null
          total_final?: number | null
          transportista?: string | null
          transportista2?: string | null
          unidades?: number | null
          unidades_2?: number | null
          unidades_3?: number | null
          url_seguimiento?: string | null
          url_seguimiento2?: string | null
          variante?: string | null
          venta_xpublicidad?: boolean | null
        }
        Relationships: []
      }
      operaciones_gastos: {
        Row: {
          area_funcional: string | null
          banco: string | null
          canal: string | null
          categoria: string | null
          categoria_macro: string | null
          clasificacion_operativa: string | null
          clasificador_maestro: string | null
          created_at: string | null
          cuenta: string | null
          descripcion: string | null
          empresa: string | null
          estatus_pago: string | null
          fecha: string
          id: number
          id_suscripcion_origen: number | null
          impacto: string | null
          metodo_pago: string | null
          monto: number
          notas: string | null
          responsable: string | null
          servicio_basico_nombre: string | null
          subcategoria: string | null
          tipo_movimiento: string
        }
        Insert: {
          area_funcional?: string | null
          banco?: string | null
          canal?: string | null
          categoria?: string | null
          categoria_macro?: string | null
          clasificacion_operativa?: string | null
          clasificador_maestro?: string | null
          created_at?: string | null
          cuenta?: string | null
          descripcion?: string | null
          empresa?: string | null
          estatus_pago?: string | null
          fecha: string
          id?: number
          id_suscripcion_origen?: number | null
          impacto?: string | null
          metodo_pago?: string | null
          monto: number
          notas?: string | null
          responsable?: string | null
          servicio_basico_nombre?: string | null
          subcategoria?: string | null
          tipo_movimiento?: string
        }
        Update: {
          area_funcional?: string | null
          banco?: string | null
          canal?: string | null
          categoria?: string | null
          categoria_macro?: string | null
          clasificacion_operativa?: string | null
          clasificador_maestro?: string | null
          created_at?: string | null
          cuenta?: string | null
          descripcion?: string | null
          empresa?: string | null
          estatus_pago?: string | null
          fecha?: string
          id?: number
          id_suscripcion_origen?: number | null
          impacto?: string | null
          metodo_pago?: string | null
          monto?: number
          notas?: string | null
          responsable?: string | null
          servicio_basico_nombre?: string | null
          subcategoria?: string | null
          tipo_movimiento?: string
        }
        Relationships: [
          {
            foreignKeyName: "operaciones_gastos_id_suscripcion_origen_fkey"
            columns: ["id_suscripcion_origen"]
            isOneToOne: false
            referencedRelation: "cat_gastos_recurrentes"
            referencedColumns: ["id_gasto_r"]
          },
          {
            foreignKeyName: "operaciones_gastos_servicio_basico_nombre_fkey"
            columns: ["servicio_basico_nombre"]
            isOneToOne: false
            referencedRelation: "cat_servicios_bas"
            referencedColumns: ["nombre_servicio"]
          },
        ]
      }
      orden_productos: {
        Row: {
          costo_unitario: number | null
          empaquetado: string | null
          id: number
          id_orden: number
          nombre_producto: string | null
          piezas: number | null
          piezas_empaquetado: number | null
        }
        Insert: {
          costo_unitario?: number | null
          empaquetado?: string | null
          id?: never
          id_orden: number
          nombre_producto?: string | null
          piezas?: number | null
          piezas_empaquetado?: number | null
        }
        Update: {
          costo_unitario?: number | null
          empaquetado?: string | null
          id?: never
          id_orden?: number
          nombre_producto?: string | null
          piezas?: number | null
          piezas_empaquetado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orden_productos_id_orden_fkey"
            columns: ["id_orden"]
            isOneToOne: false
            referencedRelation: "table_ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      order_tracking_master: {
        Row: {
          destino: string | null
          id: number
          numero_pedido: string | null
          prioridad: string | null
          status_id: string | null
          turno_id: string | null
          updated_at: string | null
          venta_id: string | null
        }
        Insert: {
          destino?: string | null
          id: number
          numero_pedido?: string | null
          prioridad?: string | null
          status_id?: string | null
          turno_id?: string | null
          updated_at?: string | null
          venta_id?: string | null
        }
        Update: {
          destino?: string | null
          id?: number
          numero_pedido?: string | null
          prioridad?: string | null
          status_id?: string | null
          turno_id?: string | null
          updated_at?: string | null
          venta_id?: string | null
        }
        Relationships: []
      }
      pagos_transferencias_master: {
        Row: {
          banco_destino: string | null
          comprobante_url: string | null
          created_at: string
          empresa_destino: string | null
          fecha_validacion: string | null
          id: number
          monto_declarado: number
          numero_pedido: string
          responsable_nombre: string | null
          status_pago: string
          updated_at: string
          vendedor_nombre: string | null
          venta_id: string
        }
        Insert: {
          banco_destino?: string | null
          comprobante_url?: string | null
          created_at?: string
          empresa_destino?: string | null
          fecha_validacion?: string | null
          id?: number
          monto_declarado?: number
          numero_pedido: string
          responsable_nombre?: string | null
          status_pago?: string
          updated_at?: string
          vendedor_nombre?: string | null
          venta_id: string
        }
        Update: {
          banco_destino?: string | null
          comprobante_url?: string | null
          created_at?: string
          empresa_destino?: string | null
          fecha_validacion?: string | null
          id?: number
          monto_declarado?: number
          numero_pedido?: string
          responsable_nombre?: string | null
          status_pago?: string
          updated_at?: string
          vendedor_nombre?: string | null
          venta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ventas_master_pagos"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas_master"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_internos_detalles_master: {
        Row: {
          cantidad: number
          cantidad_cargada: number | null
          cantidad_confirmada: number | null
          cantidad_surtida: number | null
          coordinador_carga: string | null
          created_at: string | null
          descripcion: string | null
          encargado_barra: string | null
          estado_surtido: string | null
          fecha_asignacion_encargado: string | null
          hora_carga_confirmada: string | null
          hora_llegada: string | null
          hora_surtido_confirmado: string | null
          id: number
          motivo_cambio: string | null
          motivocambio_despachador: string | null
          picker_asignado: string | null
          product_id: number
          responsable: string | null
          subcategoria: string | null
          trabajador_asignado: string | null
          updated_at: string | null
          venta_id: number
        }
        Insert: {
          cantidad?: number
          cantidad_cargada?: number | null
          cantidad_confirmada?: number | null
          cantidad_surtida?: number | null
          coordinador_carga?: string | null
          created_at?: string | null
          descripcion?: string | null
          encargado_barra?: string | null
          estado_surtido?: string | null
          fecha_asignacion_encargado?: string | null
          hora_carga_confirmada?: string | null
          hora_llegada?: string | null
          hora_surtido_confirmado?: string | null
          id?: number
          motivo_cambio?: string | null
          motivocambio_despachador?: string | null
          picker_asignado?: string | null
          product_id?: number
          responsable?: string | null
          subcategoria?: string | null
          trabajador_asignado?: string | null
          updated_at?: string | null
          venta_id: number
        }
        Update: {
          cantidad?: number
          cantidad_cargada?: number | null
          cantidad_confirmada?: number | null
          cantidad_surtida?: number | null
          coordinador_carga?: string | null
          created_at?: string | null
          descripcion?: string | null
          encargado_barra?: string | null
          estado_surtido?: string | null
          fecha_asignacion_encargado?: string | null
          hora_carga_confirmada?: string | null
          hora_llegada?: string | null
          hora_surtido_confirmado?: string | null
          id?: number
          motivo_cambio?: string | null
          motivocambio_despachador?: string | null
          picker_asignado?: string | null
          product_id?: number
          responsable?: string | null
          subcategoria?: string | null
          trabajador_asignado?: string | null
          updated_at?: string | null
          venta_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedido_maestro"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "pedidos_internos_master"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_internos_master: {
        Row: {
          cantidad: number | null
          created_at: string | null
          destino: string
          empresa_pedido: string | null
          encargado_barra: string | null
          estado: string | null
          fecha_emision: string | null
          folio: string
          id: number
          motivocambio_despachador: string | null
          nombre_solicitante: string | null
          observaciones: string | null
          status: string | null
          status_id: string | null
          subcategoria: string | null
          updated_at: string | null
          vendedor_nombre: string | null
          venta_id: number
        }
        Insert: {
          cantidad?: number | null
          created_at?: string | null
          destino: string
          empresa_pedido?: string | null
          encargado_barra?: string | null
          estado?: string | null
          fecha_emision?: string | null
          folio: string
          id?: number
          motivocambio_despachador?: string | null
          nombre_solicitante?: string | null
          observaciones?: string | null
          status?: string | null
          status_id?: string | null
          subcategoria?: string | null
          updated_at?: string | null
          vendedor_nombre?: string | null
          venta_id?: number
        }
        Update: {
          cantidad?: number | null
          created_at?: string | null
          destino?: string
          empresa_pedido?: string | null
          encargado_barra?: string | null
          estado?: string | null
          fecha_emision?: string | null
          folio?: string
          id?: number
          motivocambio_despachador?: string | null
          nombre_solicitante?: string | null
          observaciones?: string | null
          status?: string | null
          status_id?: string | null
          subcategoria?: string | null
          updated_at?: string | null
          vendedor_nombre?: string | null
          venta_id?: number
        }
        Relationships: []
      }
      presupuestos_metas: {
        Row: {
          anio: number
          categoria_macro: string
          created_at: string | null
          id: number
          mes: number
          monto: number
          updated_at: string | null
        }
        Insert: {
          anio: number
          categoria_macro: string
          created_at?: string | null
          id?: number
          mes: number
          monto?: number
          updated_at?: string | null
        }
        Update: {
          anio?: number
          categoria_macro?: string
          created_at?: string | null
          id?: number
          mes?: number
          monto?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      producto_archivos: {
        Row: {
          archivo_id: number
          created_at: string | null
          file_name: string | null
          file_path: string
          mime_type: string | null
          orden_producto_id: number
          subido_por: string | null
          tipo_archivo: Database["public"]["Enums"]["tipo_archivo_enum"]
        }
        Insert: {
          archivo_id?: number
          created_at?: string | null
          file_name?: string | null
          file_path: string
          mime_type?: string | null
          orden_producto_id: number
          subido_por?: string | null
          tipo_archivo: Database["public"]["Enums"]["tipo_archivo_enum"]
        }
        Update: {
          archivo_id?: number
          created_at?: string | null
          file_name?: string | null
          file_path?: string
          mime_type?: string | null
          orden_producto_id?: number
          subido_por?: string | null
          tipo_archivo?: Database["public"]["Enums"]["tipo_archivo_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "fk_orden_producto"
            columns: ["orden_producto_id"]
            isOneToOne: false
            referencedRelation: "orden_productos"
            referencedColumns: ["id"]
          },
        ]
      }
      publi_tienda: {
        Row: {
          cat_mdr: string | null
          costo: number | null
          created_at: string
          num_producto: string | null
          num_publi: string
          sku: string
          status: string | null
          tienda: string | null
          titulo: string | null
        }
        Insert: {
          cat_mdr?: string | null
          costo?: number | null
          created_at?: string
          num_producto?: string | null
          num_publi: string
          sku: string
          status?: string | null
          tienda?: string | null
          titulo?: string | null
        }
        Update: {
          cat_mdr?: string | null
          costo?: number | null
          created_at?: string
          num_producto?: string | null
          num_publi?: string
          sku?: string
          status?: string | null
          tienda?: string | null
          titulo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "publi_tienda_sku_fkey"
            columns: ["sku"]
            isOneToOne: false
            referencedRelation: "sku_alterno"
            referencedColumns: ["sku"]
          },
        ]
      }
      publi_xsku: {
        Row: {
          created_at: string
          num_publicaciones: number | null
          sku: string
        }
        Insert: {
          created_at?: string
          num_publicaciones?: number | null
          sku: string
        }
        Update: {
          created_at?: string
          num_publicaciones?: number | null
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "publi_xsku_sku_fkey"
            columns: ["sku"]
            isOneToOne: true
            referencedRelation: "sku_alterno"
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
            foreignKeyName: "puestos_id_empresa_fkey"
            columns: ["id_empresa"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empresa"]
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
      registro_asignacion_horas_extra: {
        Row: {
          dia_asignado: string | null
          fecha: string | null
          hora: string | null
          hora_fin: string
          hora_inicio: string
          horas_calculadas: number | null
          id: number
          id_autorizador: string | null
          id_capturista: string | null
          id_empleado: string | null
        }
        Insert: {
          dia_asignado?: string | null
          fecha?: string | null
          hora?: string | null
          hora_fin: string
          hora_inicio: string
          horas_calculadas?: number | null
          id?: number
          id_autorizador?: string | null
          id_capturista?: string | null
          id_empleado?: string | null
        }
        Update: {
          dia_asignado?: string | null
          fecha?: string | null
          hora?: string | null
          hora_fin?: string
          hora_inicio?: string
          horas_calculadas?: number | null
          id?: number
          id_autorizador?: string | null
          id_capturista?: string | null
          id_empleado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empleado_asignacion_horas_extra_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_asignacion_horas_extra_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_asignacion_horas_extra_id_capturista_fkey"
            columns: ["id_capturista"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
          {
            foreignKeyName: "empleado_asignacion_horas_extra_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_asignacion_horas_extra_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleado_asignacion_horas_extra_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
          {
            foreignKeyName: "registro_asignacion_horas_extra_id_autorizador_fkey"
            columns: ["id_autorizador"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_asignacion_horas_extra_id_autorizador_fkey"
            columns: ["id_autorizador"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_asignacion_horas_extra_id_autorizador_fkey"
            columns: ["id_autorizador"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
        ]
      }
      registro_checador: {
        Row: {
          diferencia_minutos: number | null
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
          diferencia_minutos?: number | null
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
          diferencia_minutos?: number | null
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_checador_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_capturo_fkey"
            columns: ["capturo"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
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
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_inasistencias_confirmadas_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
        ]
      }
      registro_solicitud_asistencia_30min_despues: {
        Row: {
          aceptar_asistencia_tardia: boolean | null
          fecha: string | null
          hora: string | null
          hora_aceptacion: string | null
          hora_esperada: string | null
          id: number
          id_empleado: string | null
          id_rh_autorizador: string | null
          id_ubicacion: number | null
          motivo: string | null
        }
        Insert: {
          aceptar_asistencia_tardia?: boolean | null
          fecha?: string | null
          hora?: string | null
          hora_aceptacion?: string | null
          hora_esperada?: string | null
          id?: number
          id_empleado?: string | null
          id_rh_autorizador?: string | null
          id_ubicacion?: number | null
          motivo?: string | null
        }
        Update: {
          aceptar_asistencia_tardia?: boolean | null
          fecha?: string | null
          hora?: string | null
          hora_aceptacion?: string | null
          hora_esperada?: string | null
          id?: number
          id_empleado?: string | null
          id_rh_autorizador?: string | null
          id_ubicacion?: number | null
          motivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registro_solicitud_asistencia_30min_despues_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_solicitud_asistencia_30min_despues_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleado_ubicacion_chequeo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_solicitud_asistencia_30min_despues_id_empleado_fkey"
            columns: ["id_empleado"]
            isOneToOne: false
            referencedRelation: "vista_empleados_empresa"
            referencedColumns: ["id_empleado"]
          },
        ]
      }
      rel_contenedor_productos: {
        Row: {
          contenedor_id: string
          id: number
          orden_producto_id: number
          piezas: number | null
        }
        Insert: {
          contenedor_id: string
          id?: number
          orden_producto_id: number
          piezas?: number | null
        }
        Update: {
          contenedor_id?: string
          id?: number
          orden_producto_id?: number
          piezas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contenedor"
            columns: ["contenedor_id"]
            isOneToOne: false
            referencedRelation: "table_contenedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_orden_producto"
            columns: ["orden_producto_id"]
            isOneToOne: false
            referencedRelation: "orden_productos"
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
      SALES_EXCEL: {
        Row: {
          comprador: string | null
          created_at: string
          estado: string | null
          id: number
          municipio: string | null
          nde_pub: string | null
          nde_venta: number | null
          sale_date: string | null
          sku: string | null
          tienda: string | null
          tit_pub: string | null
          variante: string | null
        }
        Insert: {
          comprador?: string | null
          created_at?: string
          estado?: string | null
          id?: number
          municipio?: string | null
          nde_pub?: string | null
          nde_venta?: number | null
          sale_date?: string | null
          sku?: string | null
          tienda?: string | null
          tit_pub?: string | null
          variante?: string | null
        }
        Update: {
          comprador?: string | null
          created_at?: string
          estado?: string | null
          id?: number
          municipio?: string | null
          nde_pub?: string | null
          nde_venta?: number | null
          sale_date?: string | null
          sku?: string | null
          tienda?: string | null
          tit_pub?: string | null
          variante?: string | null
        }
        Relationships: []
      }
      sku_alterno: {
        Row: {
          empresa: string | null
          id: number | null
          sku: string
          sku_mdr: string | null
        }
        Insert: {
          empresa?: string | null
          id?: number | null
          sku: string
          sku_mdr?: string | null
        }
        Update: {
          empresa?: string | null
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
          empresa: string | null
          esti_time: number | null
          id_producto: number
          landed_cost: number | null
          piezas_por_sku: number | null
          piezas_xcontenedor: number | null
          pz_empaquetado_master: number | null
          sku: string | null
          sku_mdr: string
          sub_cat: string | null
          tip_empa: string | null
        }
        Insert: {
          bloque?: number | null
          bodega?: string | null
          cat_mdr?: string | null
          empaquetado_master?: string | null
          empresa?: string | null
          esti_time?: number | null
          id_producto?: never
          landed_cost?: number | null
          piezas_por_sku?: number | null
          piezas_xcontenedor?: number | null
          pz_empaquetado_master?: number | null
          sku?: string | null
          sku_mdr: string
          sub_cat?: string | null
          tip_empa?: string | null
        }
        Update: {
          bloque?: number | null
          bodega?: string | null
          cat_mdr?: string | null
          empaquetado_master?: string | null
          empresa?: string | null
          esti_time?: number | null
          id_producto?: never
          landed_cost?: number | null
          piezas_por_sku?: number | null
          piezas_xcontenedor?: number | null
          pz_empaquetado_master?: number | null
          sku?: string | null
          sku_mdr?: string
          sub_cat?: string | null
          tip_empa?: string | null
        }
        Relationships: []
      }
      sku_m_palo_de_rosa: {
        Row: {
          cat_mdr: string | null
          created_at: string
          id: number
          precio: number | null
          sku: string
          status: string | null
          tipo: string | null
          titulo: string | null
          variante: string | null
        }
        Insert: {
          cat_mdr?: string | null
          created_at?: string
          id: number
          precio?: number | null
          sku: string
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          variante?: string | null
        }
        Update: {
          cat_mdr?: string | null
          created_at?: string
          id?: number
          precio?: number | null
          sku?: string
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          variante?: string | null
        }
        Relationships: []
      }
      status_pedido_master: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          nombre: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          nombre: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      stock_consolidado_masterOLD: {
        Row: {
          created_at: string
          empresa_id: number | null
          id: number
          nombre_empresa: string | null
          nombre_producto: string | null
          product_id: number | null
          stock_actual: number | null
          stock_minimo: number | null
          ubicacion_id: number | null
        }
        Insert: {
          created_at?: string
          empresa_id?: number | null
          id?: number
          nombre_empresa?: string | null
          nombre_producto?: string | null
          product_id?: number | null
          stock_actual?: number | null
          stock_minimo?: number | null
          ubicacion_id?: number | null
        }
        Update: {
          created_at?: string
          empresa_id?: number | null
          id?: number
          nombre_empresa?: string | null
          nombre_producto?: string | null
          product_id?: number | null
          stock_actual?: number | null
          stock_minimo?: number | null
          ubicacion_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_producto"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ubicacion"
            columns: ["ubicacion_id"]
            isOneToOne: false
            referencedRelation: "location_master"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          active: boolean | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          id: string
          name: string
          payment_terms_days: number | null
        }
        Insert: {
          active?: boolean | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          name: string
          payment_terms_days?: number | null
        }
        Update: {
          active?: boolean | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          name?: string
          payment_terms_days?: number | null
        }
        Relationships: []
      }
      table_agentes_aduanales: {
        Row: {
          ciudad: string | null
          created_at: string
          direccion: string | null
          email: string | null
          empresa: string | null
          id: number
          nombre: string
          pais: string | null
          telefono: string | null
        }
        Insert: {
          ciudad?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          empresa?: string | null
          id?: number
          nombre: string
          pais?: string | null
          telefono?: string | null
        }
        Update: {
          ciudad?: string | null
          created_at?: string
          direccion?: string | null
          email?: string | null
          empresa?: string | null
          id?: number
          nombre?: string
          pais?: string | null
          telefono?: string | null
        }
        Relationships: []
      }
      table_check_orden_estatus: {
        Row: {
          comentarios: string | null
          estatus: string
          fecha_cambio: string
          id: number
          orden_id: number
          usuario: string
        }
        Insert: {
          comentarios?: string | null
          estatus: string
          fecha_cambio?: string
          id?: number
          orden_id: number
          usuario: string
        }
        Update: {
          comentarios?: string | null
          estatus?: string
          fecha_cambio?: string
          id?: number
          orden_id?: number
          usuario?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_check_orden_estatus_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "table_ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      table_contenedores: {
        Row: {
          created_at: string | null
          fecha_llegada: string | null
          fecha_salida: string | null
          id: string
          numero_contenedor: string
          orden_compra_id: number
        }
        Insert: {
          created_at?: string | null
          fecha_llegada?: string | null
          fecha_salida?: string | null
          id?: string
          numero_contenedor: string
          orden_compra_id: number
        }
        Update: {
          created_at?: string | null
          fecha_llegada?: string | null
          fecha_salida?: string | null
          id?: string
          numero_contenedor?: string
          orden_compra_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_orden"
            columns: ["orden_compra_id"]
            isOneToOne: false
            referencedRelation: "table_ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      table_embarques: {
        Row: {
          ata: string | null
          atd: string | null
          created_at: string | null
          embarque_id: number
          estatus: string
          eta: string | null
          etd: string | null
          fecha_aduana: string | null
          fecha_entrega_cedis: string | null
          forwarder: string | null
          naviera: string | null
          numero_contenedor: string | null
          orden_id: number
          tipo_contenedor: string | null
          updated_at: string | null
        }
        Insert: {
          ata?: string | null
          atd?: string | null
          created_at?: string | null
          embarque_id?: number
          estatus?: string
          eta?: string | null
          etd?: string | null
          fecha_aduana?: string | null
          fecha_entrega_cedis?: string | null
          forwarder?: string | null
          naviera?: string | null
          numero_contenedor?: string | null
          orden_id: number
          tipo_contenedor?: string | null
          updated_at?: string | null
        }
        Update: {
          ata?: string | null
          atd?: string | null
          created_at?: string | null
          embarque_id?: number
          estatus?: string
          eta?: string | null
          etd?: string | null
          fecha_aduana?: string | null
          fecha_entrega_cedis?: string | null
          forwarder?: string | null
          naviera?: string | null
          numero_contenedor?: string | null
          orden_id?: number
          tipo_contenedor?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      table_empresa: {
        Row: {
          empresa_id: number
          empresa_nombre: string | null
        }
        Insert: {
          empresa_id?: number
          empresa_nombre?: string | null
        }
        Update: {
          empresa_id?: number
          empresa_nombre?: string | null
        }
        Relationships: []
      }
      table_facturas_importacion: {
        Row: {
          created_at: string
          created_by: string | null
          fecha_factura: string
          id: number
          numero_factura: string
          orden_id: number
          tipo_cambio_final: number
          total_moneda_origen: number
          total_mxn_real: number
          url_pdf: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          fecha_factura: string
          id?: number
          numero_factura: string
          orden_id: number
          tipo_cambio_final: number
          total_moneda_origen: number
          total_mxn_real: number
          url_pdf?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          fecha_factura?: string
          id?: number
          numero_factura?: string
          orden_id?: number
          tipo_cambio_final?: number
          total_moneda_origen?: number
          total_mxn_real?: number
          url_pdf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_facturas_importacion_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "table_ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      table_gastos_imp: {
        Row: {
          created_at: string | null
          id: number
          id_orden: number | null
          impuestos_derechos_mxn: number | null
          logistica_internacional_mxn: number | null
          logistica_nacional_mxn: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          id_orden?: number | null
          impuestos_derechos_mxn?: number | null
          logistica_internacional_mxn?: number | null
          logistica_nacional_mxn?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          id_orden?: number | null
          impuestos_derechos_mxn?: number | null
          logistica_internacional_mxn?: number | null
          logistica_nacional_mxn?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "table_gastos_imp_id_orden_fkey"
            columns: ["id_orden"]
            isOneToOne: false
            referencedRelation: "table_ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      table_orden_historial_fechas: {
        Row: {
          actualizado_por: string | null
          comentario: string | null
          created_at: string | null
          historial_id: number
          id_orden: number
          tipo_fecha: string
          valor: string
          valor_anterior: string | null
        }
        Insert: {
          actualizado_por?: string | null
          comentario?: string | null
          created_at?: string | null
          historial_id?: number
          id_orden: number
          tipo_fecha: string
          valor: string
          valor_anterior?: string | null
        }
        Update: {
          actualizado_por?: string | null
          comentario?: string | null
          created_at?: string | null
          historial_id?: number
          id_orden?: number
          tipo_fecha?: string
          valor?: string
          valor_anterior?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_historial_orden"
            columns: ["id_orden"]
            isOneToOne: false
            referencedRelation: "table_ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      table_ordenes_compra: {
        Row: {
          ata: string | null
          atd: string | null
          con_credito: boolean | null
          contenedores: number | null
          created_at: string
          created_by: string | null
          dias_credito: number | null
          empaquetado: string | null
          empresa_destino_id: number
          entidad_importacion: string | null
          estatus: string
          eta: string | null
          etd: string | null
          fecha_orden: string
          id: number
          id_proveedor: number | null
          importacion_directa: boolean | null
          llegada_yautepec_estimada: string | null
          llegada_yautepec_real: string | null
          moneda: string
          num_contenedores: string | null
          producto: string | null
          t_piezas: number | null
          tipo_cambio_ref: number | null
          tipo_compra: string | null
          total_estimado_moneda_origen: number
          total_estimado_mxn: number | null
        }
        Insert: {
          ata?: string | null
          atd?: string | null
          con_credito?: boolean | null
          contenedores?: number | null
          created_at?: string
          created_by?: string | null
          dias_credito?: number | null
          empaquetado?: string | null
          empresa_destino_id: number
          entidad_importacion?: string | null
          estatus: string
          eta?: string | null
          etd?: string | null
          fecha_orden: string
          id?: number
          id_proveedor?: number | null
          importacion_directa?: boolean | null
          llegada_yautepec_estimada?: string | null
          llegada_yautepec_real?: string | null
          moneda: string
          num_contenedores?: string | null
          producto?: string | null
          t_piezas?: number | null
          tipo_cambio_ref?: number | null
          tipo_compra?: string | null
          total_estimado_moneda_origen: number
          total_estimado_mxn?: number | null
        }
        Update: {
          ata?: string | null
          atd?: string | null
          con_credito?: boolean | null
          contenedores?: number | null
          created_at?: string
          created_by?: string | null
          dias_credito?: number | null
          empaquetado?: string | null
          empresa_destino_id?: number
          entidad_importacion?: string | null
          estatus?: string
          eta?: string | null
          etd?: string | null
          fecha_orden?: string
          id?: number
          id_proveedor?: number | null
          importacion_directa?: boolean | null
          llegada_yautepec_estimada?: string | null
          llegada_yautepec_real?: string | null
          moneda?: string
          num_contenedores?: string | null
          producto?: string | null
          t_piezas?: number | null
          tipo_cambio_ref?: number | null
          tipo_compra?: string | null
          total_estimado_moneda_origen?: number
          total_estimado_mxn?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_empresa_fk"
            columns: ["empresa_destino_id"]
            isOneToOne: false
            referencedRelation: "table_empresa"
            referencedColumns: ["empresa_id"]
          },
          {
            foreignKeyName: "table_ordenes_compra_id_proveedor_fkey"
            columns: ["id_proveedor"]
            isOneToOne: false
            referencedRelation: "table_proveedores"
            referencedColumns: ["id_proveedor"]
          },
        ]
      }
      table_ordenes_compra_detalle: {
        Row: {
          cantidad: number | null
          costo_unitario_moneda_origen: number | null
          created_at: string
          detalle_id: number
          orden_id: number | null
          sku_madre_id: number | null
          subtotal: number | null
        }
        Insert: {
          cantidad?: number | null
          costo_unitario_moneda_origen?: number | null
          created_at?: string
          detalle_id?: number
          orden_id?: number | null
          sku_madre_id?: number | null
          subtotal?: number | null
        }
        Update: {
          cantidad?: number | null
          costo_unitario_moneda_origen?: number | null
          created_at?: string
          detalle_id?: number
          orden_id?: number | null
          sku_madre_id?: number | null
          subtotal?: number | null
        }
        Relationships: []
      }
      table_pagos_orden: {
        Row: {
          created_at: string
          fecha_pago: string | null
          id_pago_programado: number | null
          monto_moneda_origen: number | null
          monto_mxn_real: number | null
          pago_id: number
          referencia_bancaria: string | null
          tipo_cambio_pago: number | null
          tipo_pago: string | null
          url_boucher: string | null
          usuario: string | null
        }
        Insert: {
          created_at?: string
          fecha_pago?: string | null
          id_pago_programado?: number | null
          monto_moneda_origen?: number | null
          monto_mxn_real?: number | null
          pago_id?: number
          referencia_bancaria?: string | null
          tipo_cambio_pago?: number | null
          tipo_pago?: string | null
          url_boucher?: string | null
          usuario?: string | null
        }
        Update: {
          created_at?: string
          fecha_pago?: string | null
          id_pago_programado?: number | null
          monto_moneda_origen?: number | null
          monto_mxn_real?: number | null
          pago_id?: number
          referencia_bancaria?: string | null
          tipo_cambio_pago?: number | null
          tipo_pago?: string | null
          url_boucher?: string | null
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_pagos_orden_id_pago_programado_fkey"
            columns: ["id_pago_programado"]
            isOneToOne: false
            referencedRelation: "table_pagos_programados"
            referencedColumns: ["id"]
          },
        ]
      }
      table_pagos_programados: {
        Row: {
          descripcion: string
          estatus: string
          fecha_programada: string
          id: number
          monto_pagar: number | null
          orden_id: number
        }
        Insert: {
          descripcion: string
          estatus?: string
          fecha_programada: string
          id?: number
          monto_pagar?: number | null
          orden_id: number
        }
        Update: {
          descripcion?: string
          estatus?: string
          fecha_programada?: string
          id?: number
          monto_pagar?: number | null
          orden_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "table_pagos_programados_orden_id_fkey"
            columns: ["orden_id"]
            isOneToOne: false
            referencedRelation: "table_ordenes_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      table_productos: {
        Row: {
          id_producto: number
          nombre: string
        }
        Insert: {
          id_producto?: never
          nombre: string
        }
        Update: {
          id_producto?: never
          nombre?: string
        }
        Relationships: []
      }
      table_profiles: {
        Row: {
          email: string | null
          id: string
          last_seen: string | null
          role: string | null
        }
        Insert: {
          email?: string | null
          id: string
          last_seen?: string | null
          role?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          last_seen?: string | null
          role?: string | null
        }
        Relationships: []
      }
      table_proveedor_productos: {
        Row: {
          id: number
          producto_id: number | null
          proveedor_id: number | null
        }
        Insert: {
          id?: never
          producto_id?: number | null
          proveedor_id?: number | null
        }
        Update: {
          id?: never
          producto_id?: number | null
          proveedor_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_producto"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "table_productos"
            referencedColumns: ["id_producto"]
          },
          {
            foreignKeyName: "fk_proveedor"
            columns: ["proveedor_id"]
            isOneToOne: false
            referencedRelation: "table_proveedores"
            referencedColumns: ["id_proveedor"]
          },
        ]
      }
      table_proveedores: {
        Row: {
          ciudad: string | null
          condado: string | null
          credito: boolean | null
          id_proveedor: number
          meses_credito: number | null
          nombre: string | null
          numero_contacto: string | null
          pais: string | null
          provincia: string | null
          puesto_vendedor: string | null
          tiempo_produccion: number | null
          tipo_proveedor: string | null
          vendedor: string | null
        }
        Insert: {
          ciudad?: string | null
          condado?: string | null
          credito?: boolean | null
          id_proveedor?: number
          meses_credito?: number | null
          nombre?: string | null
          numero_contacto?: string | null
          pais?: string | null
          provincia?: string | null
          puesto_vendedor?: string | null
          tiempo_produccion?: number | null
          tipo_proveedor?: string | null
          vendedor?: string | null
        }
        Update: {
          ciudad?: string | null
          condado?: string | null
          credito?: boolean | null
          id_proveedor?: number
          meses_credito?: number | null
          nombre?: string | null
          numero_contacto?: string | null
          pais?: string | null
          provincia?: string | null
          puesto_vendedor?: string | null
          tiempo_produccion?: number | null
          tipo_proveedor?: string | null
          vendedor?: string | null
        }
        Relationships: []
      }
      table_recepcion_contenedor: {
        Row: {
          bloque: string
          bodega: string
          cantidad_recibida: number
          confirmado_por: string
          contenedor_id: string
          created_at: string | null
          fecha_llegada: string
          id: number
          lugar_llegada: string
          tipo_acomodo: string | null
          updated_at: string | null
        }
        Insert: {
          bloque: string
          bodega: string
          cantidad_recibida: number
          confirmado_por: string
          contenedor_id: string
          created_at?: string | null
          fecha_llegada: string
          id?: number
          lugar_llegada: string
          tipo_acomodo?: string | null
          updated_at?: string | null
        }
        Update: {
          bloque?: string
          bodega?: string
          cantidad_recibida?: number
          confirmado_por?: string
          contenedor_id?: string
          created_at?: string | null
          fecha_llegada?: string
          id?: number
          lugar_llegada?: string
          tipo_acomodo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contenedor"
            columns: ["contenedor_id"]
            isOneToOne: false
            referencedRelation: "table_contenedores"
            referencedColumns: ["id"]
          },
        ]
      }
      table_tareas: {
        Row: {
          created_at: string
          descripción: string | null
          fecha: string | null
          hora: string | null
          id: number
          id_tipo_tarea: number | null
          id_usuario: number | null
          prioridad: string | null
          titulo: string | null
        }
        Insert: {
          created_at?: string
          descripción?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_tipo_tarea?: number | null
          id_usuario?: number | null
          prioridad?: string | null
          titulo?: string | null
        }
        Update: {
          created_at?: string
          descripción?: string | null
          fecha?: string | null
          hora?: string | null
          id?: number
          id_tipo_tarea?: number | null
          id_usuario?: number | null
          prioridad?: string | null
          titulo?: string | null
        }
        Relationships: []
      }
      table_tipos_tareas: {
        Row: {
          id: number
          nombre: string | null
        }
        Insert: {
          id?: number
          nombre?: string | null
        }
        Update: {
          id?: number
          nombre?: string | null
        }
        Relationships: []
      }
      tablero_prod_diaria_master: {
        Row: {
          created_at: string
          estado: string
          fecha_operativa: string
          id: number
          items_confirmados: number
          items_pendientes: number
          pedidos_asignados: number
          pedidos_finalizados: number
          total_items: number
          trabajador_id: string
          trabajador_nombre: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado?: string
          fecha_operativa: string
          id?: number
          items_confirmados?: number
          items_pendientes?: number
          pedidos_asignados?: number
          pedidos_finalizados?: number
          total_items?: number
          trabajador_id: string
          trabajador_nombre?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado?: string
          fecha_operativa?: string
          id?: number
          items_confirmados?: number
          items_pendientes?: number
          pedidos_asignados?: number
          pedidos_finalizados?: number
          total_items?: number
          trabajador_id?: string
          trabajador_nombre?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tickets_surtido_master: {
        Row: {
          created_at: string
          detalle_id: string | null
          folio: string | null
          id: number
          is_group_ticket: boolean | null
          subfolio: string | null
          ticket_data: string | null
          venta_id: string
        }
        Insert: {
          created_at?: string
          detalle_id?: string | null
          folio?: string | null
          id?: number
          is_group_ticket?: boolean | null
          subfolio?: string | null
          ticket_data?: string | null
          venta_id?: string
        }
        Update: {
          created_at?: string
          detalle_id?: string | null
          folio?: string | null
          id?: number
          is_group_ticket?: boolean | null
          subfolio?: string | null
          ticket_data?: string | null
          venta_id?: string
        }
        Relationships: []
      }
      trabajadores_master: {
        Row: {
          area: string | null
          capacitaciones: string | null
          check_list_dia: string | null
          cumpleaños: string | null
          descanso: string | null
          direccion: string | null
          empresa: string | null
          fecha_ingreso: string | null
          funcion_system: string | null
          herramienta_trabajo: string | null
          hora_entrada: string | null
          hora_salida: string | null
          horas_extras: number | null
          id: number
          nomb_persona_contacto: string | null
          nombre: string | null
          puesto: string | null
          status: string | null
          telefono: string | null
          telefono_contacto: string | null
        }
        Insert: {
          area?: string | null
          capacitaciones?: string | null
          check_list_dia?: string | null
          cumpleaños?: string | null
          descanso?: string | null
          direccion?: string | null
          empresa?: string | null
          fecha_ingreso?: string | null
          funcion_system?: string | null
          herramienta_trabajo?: string | null
          hora_entrada?: string | null
          hora_salida?: string | null
          horas_extras?: number | null
          id?: number
          nomb_persona_contacto?: string | null
          nombre?: string | null
          puesto?: string | null
          status?: string | null
          telefono?: string | null
          telefono_contacto?: string | null
        }
        Update: {
          area?: string | null
          capacitaciones?: string | null
          check_list_dia?: string | null
          cumpleaños?: string | null
          descanso?: string | null
          direccion?: string | null
          empresa?: string | null
          fecha_ingreso?: string | null
          funcion_system?: string | null
          herramienta_trabajo?: string | null
          hora_entrada?: string | null
          hora_salida?: string | null
          horas_extras?: number | null
          id?: number
          nomb_persona_contacto?: string | null
          nombre?: string | null
          puesto?: string | null
          status?: string | null
          telefono?: string | null
          telefono_contacto?: string | null
        }
        Relationships: []
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
      ventas_detalles_master: {
        Row: {
          assigned_worker_id: string | null
          cantidad: number
          cantidad_surtida: number | null
          descripcion: string | null
          encargado_barra: string | null
          estado_surtido: string | null
          fecha_asignacion_encargado: string | null
          fecha_ticket_generado: string | null
          id: string
          importe: number | null
          last_ticketed_quantity: number | null
          motivocambio_despachador: string | null
          precio_unitario: number
          product_id: number | null
          sku: string | null
          subtotal: number | null
          trabajador_asignado: string | null
          updated_at: string | null
          venta_id: string
          ventas_id: string
        }
        Insert: {
          assigned_worker_id?: string | null
          cantidad: number
          cantidad_surtida?: number | null
          descripcion?: string | null
          encargado_barra?: string | null
          estado_surtido?: string | null
          fecha_asignacion_encargado?: string | null
          fecha_ticket_generado?: string | null
          id?: string
          importe?: number | null
          last_ticketed_quantity?: number | null
          motivocambio_despachador?: string | null
          precio_unitario: number
          product_id?: number | null
          sku?: string | null
          subtotal?: number | null
          trabajador_asignado?: string | null
          updated_at?: string | null
          venta_id?: string
          ventas_id?: string
        }
        Update: {
          assigned_worker_id?: string | null
          cantidad?: number
          cantidad_surtida?: number | null
          descripcion?: string | null
          encargado_barra?: string | null
          estado_surtido?: string | null
          fecha_asignacion_encargado?: string | null
          fecha_ticket_generado?: string | null
          id?: string
          importe?: number | null
          last_ticketed_quantity?: number | null
          motivocambio_despachador?: string | null
          precio_unitario?: number
          product_id?: number | null
          sku?: string | null
          subtotal?: number | null
          trabajador_asignado?: string | null
          updated_at?: string | null
          venta_id?: string
          ventas_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ventas_detalles_master_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory_master"
            referencedColumns: ["id"]
          },
        ]
      }
      ventas_master: {
        Row: {
          abono: number | null
          banco_transferencia: string | null
          cliente_direccion: string | null
          cliente_nombre: string
          cliente_telefono: string | null
          confirmador_salida: string | null
          empresa_transferencia: string | null
          encargado_barra: string | null
          factura: string | null
          factura_cp: string | null
          factura_email: string | null
          factura_forma_pago: string | null
          factura_razon_social: string | null
          factura_regimen_fiscal: string | null
          factura_rfc: string | null
          factura_uso_cfdi: string | null
          fecha_asignacion_barra: string | null
          fecha_emision: string | null
          fecha_salida_confirmada: string | null
          fecha_salida_generada: string | null
          folio: string
          forma_pago: string | null
          id: string
          iva: number | null
          observaciones: string | null
          plataforma: string | null
          recibio_efectivo_nombre: string | null
          saldo_pendiente: number | null
          status_id: string | null
          subtotal: number | null
          total: number | null
          updated_at: string | null
          vendedor_nombre: string | null
          venta_id: string
          ventas_id: string
        }
        Insert: {
          abono?: number | null
          banco_transferencia?: string | null
          cliente_direccion?: string | null
          cliente_nombre: string
          cliente_telefono?: string | null
          confirmador_salida?: string | null
          empresa_transferencia?: string | null
          encargado_barra?: string | null
          factura?: string | null
          factura_cp?: string | null
          factura_email?: string | null
          factura_forma_pago?: string | null
          factura_razon_social?: string | null
          factura_regimen_fiscal?: string | null
          factura_rfc?: string | null
          factura_uso_cfdi?: string | null
          fecha_asignacion_barra?: string | null
          fecha_emision?: string | null
          fecha_salida_confirmada?: string | null
          fecha_salida_generada?: string | null
          folio: string
          forma_pago?: string | null
          id?: string
          iva?: number | null
          observaciones?: string | null
          plataforma?: string | null
          recibio_efectivo_nombre?: string | null
          saldo_pendiente?: number | null
          status_id?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          vendedor_nombre?: string | null
          venta_id?: string
          ventas_id?: string
        }
        Update: {
          abono?: number | null
          banco_transferencia?: string | null
          cliente_direccion?: string | null
          cliente_nombre?: string
          cliente_telefono?: string | null
          confirmador_salida?: string | null
          empresa_transferencia?: string | null
          encargado_barra?: string | null
          factura?: string | null
          factura_cp?: string | null
          factura_email?: string | null
          factura_forma_pago?: string | null
          factura_razon_social?: string | null
          factura_regimen_fiscal?: string | null
          factura_rfc?: string | null
          factura_uso_cfdi?: string | null
          fecha_asignacion_barra?: string | null
          fecha_emision?: string | null
          fecha_salida_confirmada?: string | null
          fecha_salida_generada?: string | null
          folio?: string
          forma_pago?: string | null
          id?: string
          iva?: number | null
          observaciones?: string | null
          plataforma?: string | null
          recibio_efectivo_nombre?: string | null
          saldo_pendiente?: number | null
          status_id?: string | null
          subtotal?: number | null
          total?: number | null
          updated_at?: string | null
          vendedor_nombre?: string | null
          venta_id?: string
          ventas_id?: string
        }
        Relationships: []
      }
    }
    Views: {
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
      vista_empleados_empresa: {
        Row: {
          id_empleado: string | null
          id_empresa: number | null
          id_estatus: number | null
        }
        Relationships: []
      }
      vista_usuario_roles: {
        Row: {
          id_usuario: string | null
          nombre_rol: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_revoke_user_sessions: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      ejecutar_gastos_recurrentes: { Args: never; Returns: undefined }
      generar_asistencia_diaria: {
        Args: { p_fecha: string }
        Returns: undefined
      }
      generar_gastos_recurrentes: { Args: never; Returns: undefined }
      verificar_identidad_biometrica: {
        Args: {
          descriptor_param: Json
          id_empleado_param: string
          p_umbral?: number
        }
        Returns: number
      }
    }
    Enums: {
      estado_llegada_enum: "BUENO" | "REGULAR" | "DANIADO" | "MUY_DANIADO"
      estatus_orden:
        | "EN_PRODUCCION"
        | "LISTO_PARA_CARGA"
        | "EN_EL_MAR"
        | "EN_MANZANILLO"
        | "EN_CAMINO_A_BODEGA"
        | "ENTREGADO"
      tipo_archivo_enum: "etiqueta_qr" | "diseno_caja" | "branding"
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
    Enums: {
      estado_llegada_enum: ["BUENO", "REGULAR", "DANIADO", "MUY_DANIADO"],
      estatus_orden: [
        "EN_PRODUCCION",
        "LISTO_PARA_CARGA",
        "EN_EL_MAR",
        "EN_MANZANILLO",
        "EN_CAMINO_A_BODEGA",
        "ENTREGADO",
      ],
      tipo_archivo_enum: ["etiqueta_qr", "diseno_caja", "branding"],
    },
  },
} as const
