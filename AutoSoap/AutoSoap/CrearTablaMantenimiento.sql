USE [TU_BASE_DE_DATOS]; -- Reemplaza con el nombre de tu base de datos
GO

-- Crear la tabla Mantenimiento (REST)
CREATE TABLE [dbo].[Mantenimiento](
	[IdMantenimiento] [int] IDENTITY(1,1) NOT NULL,
	[Fecha] [date] NOT NULL,
	[Tipo] [varchar](100) NOT NULL,
	[Descripcion] [varchar](255) NOT NULL,
	[Costo] [decimal](18, 2) NOT NULL,
	[Kilometraje] [decimal](18, 2) NOT NULL,
	[Estado] [bit] NOT NULL, -- Asumiendo INT(BIT) del pizarrón
	[IdVehiculo] [int] NOT NULL,
 CONSTRAINT [PK_Mantenimiento] PRIMARY KEY CLUSTERED 
(
	[IdMantenimiento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Añadir llave foránea a Vehiculo
ALTER TABLE [dbo].[Mantenimiento]  WITH CHECK ADD  CONSTRAINT [FK_Mantenimiento_Vehiculo] FOREIGN KEY([IdVehiculo])
REFERENCES [dbo].[Vehiculo] ([IdVehiculo])
ON DELETE CASCADE -- O NO ACTION, dependiendo de tus reglas de negocio
GO

ALTER TABLE [dbo].[Mantenimiento] CHECK CONSTRAINT [FK_Mantenimiento_Vehiculo]
GO
