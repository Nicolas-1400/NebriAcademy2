
const fs = require('fs');
const path = require('path');

const assets = path.join(__dirname, 'src', 'assets');

// Step 1: Rename FILES inside folders first (before renaming folders)
const fileRenames = [
  // Fondos
  ['Fondos/FondoLogin.png',           'Fondos/LoginBackground.png'],
  ['Fondos/FondoLogin_rotado.png',    'Fondos/LoginBackgroundRotated.png'],
  ['Fondos/fondo-biblioteca.jpg',     'Fondos/library-background.jpg'],
  ['Fondos/fondo-apuntes.png',        'Fondos/notes-background.png'],
  ['Fondos/fondo-clase.jpg',          'Fondos/classroom-background.jpg'],
  // Iconos
  ['Iconos/Campana-pendiente.png',    'Iconos/bell-pending.png'],
  ['Iconos/Campana-check.png',        'Iconos/bell-check.png'],
  ['Iconos/editar-archivo1.png',      'Iconos/edit-file1.png'],
  ['Iconos/Eliminar.png',             'Iconos/delete.png'],
  ['Iconos/familiaNebrija.png',       'Iconos/nebrijaFamily.png'],
  ['Iconos/flecha-correcta-marcada.png', 'Iconos/arrow-correct-marked.png'],
  ['Iconos/flecha-correcta.png',      'Iconos/arrow-correct.png'],
  ['Iconos/ImagenPerfilUsuario.png',  'Iconos/DefaultProfileImage.png'],
  ['Iconos/individuo.png',            'Iconos/individual.png'],
  ['Iconos/lapiz-cancelar3.png',      'Iconos/pencil-cancel3.png'],
  ['Iconos/lapiz.png',                'Iconos/pencil.png'],
  ['Iconos/mas.png',                  'Iconos/plus.png'],
  ['Iconos/me-gusta-marcado.png',     'Iconos/like-marked.png'],
  ['Iconos/me-gusta.png',             'Iconos/like.png'],
  ['Iconos/menuHamburguesa.png',      'Iconos/hamburger-menu.png'],
  ['Iconos/profesor.png',             'Iconos/professor.png'],
  ['Iconos/subir-archivo.png',        'Iconos/upload-file.png'],
  ['Iconos/subir-archivo2.png',       'Iconos/upload-file2.png'],
  ['Iconos/botonMas.png',             'Iconos/button-plus.png'],
  // perfiles
  ...Array.from({length:16}, (_,i) => [`perfiles/hombre-${i+1}.png`, `perfiles/male-${i+1}.png`]),
  ...Array.from({length:16}, (_,i) => [`perfiles/mujer-${i+1}.png`,  `perfiles/female-${i+1}.png`]),
];

// Step 2: Rename the folders themselves
const folderRenames = [
  ['Fondos',        'Backgrounds'],
  ['Iconos',        'Icons'],
  ['ImagenesCursos','CourseImages'],
  ['perfiles',      'profiles'],
];

console.log('=== Renaming files ===');
for (const [oldRel, newRel] of fileRenames) {
  const oldPath = path.join(assets, oldRel);
  const newPath = path.join(assets, newRel);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`  ✓ ${oldRel} → ${path.basename(newRel)}`);
  } else {
    console.log(`  ⚠ NOT FOUND: ${oldRel}`);
  }
}

console.log('\n=== Renaming folders ===');
for (const [oldName, newName] of folderRenames) {
  const oldPath = path.join(assets, oldName);
  const newPath = path.join(assets, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`  ✓ ${oldName}/ → ${newName}/`);
  } else {
    console.log(`  ⚠ NOT FOUND: ${oldName}/`);
  }
}

console.log('\nDone. Now verify with: node -e "require(\'fs\').readdirSync(\'src/assets\').forEach(d=>console.log(d))"');
