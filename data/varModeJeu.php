<script>
//Création des superes globales
    
    // Mode de jeu
    let modeSolo = false
    let modeOnline = false

    <?php if ($mode === 'solo') { ?>
        modeSolo = true
    <?php } elseif ($mode === 'duo') { ?>
        modeSolo = false
    <?php } elseif ($mode === 'online') { ?>
        modeOnline = true
        
        // Définition des joueurs
        <?php if($currentPlayer === 'Joueur rouge') { ?>
            let player = "red"
        <?php } else if ($currentPlayer === 'Joueur jaune') { ?>
            let player = "yellow"
        <?php } else { ?>
            console.log("erreur, pas de joueur attribué à cette session")
        <?php } ?>

    <?php } else { ?>
        modeSolo = true // De nouveau, solo en cas de problème
    <?php } ?>

</script>