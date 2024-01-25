<script>
//Création des superes globales
    
    // Mode de jeu
    let modeSolo = false
    let modeOnline = false

    //Chargement des informations de mode de jeu
    <?php $mode = isset($_GET['mode']) ? $_GET['mode']: 'solo'; //solo en valeur par défaut en cas de problème

    // Nettoyage de la variable pour contrer une attaque XSS
    $mode = htmlspecialchars($mode, ENT_QUOTES, 'UTF-8');
    ?>

    <?php if ($mode === 'solo') { ?>
        modeSolo = true
    <?php } elseif ($mode === 'duo') { ?>
        modeSolo = false
    <?php } elseif ($mode === 'online') { ?>
        modeOnline = true
    <?php } else { ?>
        modeSolo = true // De nouveau, solo en cas de problème
    <?php } ?>

</script>